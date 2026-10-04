"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => SeqNavPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  sortBy: "mtime",
  scope: "vault",
  wrapAround: false
};
var CMD_PREV = "open-previous-note";
var CMD_NEXT = "open-next-note";
var DEFAULT_HOTKEYS = {
  [CMD_PREV]: [{ modifiers: ["Alt"], key: "[" }],
  [CMD_NEXT]: [{ modifiers: ["Alt"], key: "]" }]
};
var SeqNavPlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addCommand({
      id: CMD_PREV,
      name: "Open previous note",
      callback: () => this.navigate(-1)
    });
    this.addCommand({
      id: CMD_NEXT,
      name: "Open next note",
      callback: () => this.navigate(1)
    });
    this.addSettingTab(new SeqNavSettingTab(this.app, this));
    this.seedDefaultHotkeys();
  }
  /**
   * Try to write default hotkeys into Obsidian's hotkey config.
   * Uses undocumented internals; falls back to a notice if unavailable.
   * Existing user bindings are never overwritten.
   */
  seedDefaultHotkeys() {
    const app = this.app;
    const hm = app.hotkeyManager;
    if (!hm || !hm.customKeys) {
      new import_obsidian.Notice("Sequential Note Navigator: bind Alt+[ and Alt+] in Settings -> Hotkeys.");
      return;
    }
    let changed = false;
    for (const [cmdId, bindings] of Object.entries(DEFAULT_HOTKEYS)) {
      const fullId = `${this.manifest.id}:${cmdId}`;
      const existing = hm.customKeys[fullId];
      if (existing && existing.length > 0)
        continue;
      hm.customKeys[fullId] = bindings.map((b) => ({
        modifiers: b.modifiers,
        key: b.key
      }));
      changed = true;
    }
    if (changed && typeof hm.save === "function") {
      try {
        hm.save();
      } catch (e) {
        console.warn("SeqNav: could not persist hotkeys", e);
      }
    }
  }
  async navigate(direction) {
    const active = this.app.workspace.getActiveFile();
    if (!active) {
      new import_obsidian.Notice("No active note.");
      return;
    }
    const ordered = this.getOrderedNotes(active);
    const idx = ordered.findIndex((f) => f.path === active.path);
    if (idx === -1)
      return;
    let target = idx + direction;
    if (target < 0 || target >= ordered.length) {
      if (!this.settings.wrapAround) {
        new import_obsidian.Notice(direction === 1 ? "Already at last note." : "Already at first note.");
        return;
      }
      target = (target + ordered.length) % ordered.length;
    }
    await this.app.workspace.getLeaf(false).openFile(ordered[target]);
  }
  getOrderedNotes(active) {
    const all = this.app.vault.getMarkdownFiles();
    const inScope = this.settings.scope === "folder" ? all.filter((f) => {
      var _a, _b;
      return ((_a = f.parent) == null ? void 0 : _a.path) === ((_b = active.parent) == null ? void 0 : _b.path);
    }) : all;
    const sortBy = this.settings.sortBy;
    return inScope.sort((a, b) => {
      const av = sortBy === "ctime" ? a.stat.ctime : a.stat.mtime;
      const bv = sortBy === "ctime" ? b.stat.ctime : b.stat.mtime;
      if (av !== bv)
        return av - bv;
      return a.path.localeCompare(b.path);
    });
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var SeqNavSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Sort by").setDesc("Which timestamp to use for ordering notes.").addDropdown(
      (dd) => dd.addOption("mtime", "Modification time").addOption("ctime", "Creation time").setValue(this.plugin.settings.sortBy).onChange(async (v) => {
        this.plugin.settings.sortBy = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Scope").setDesc("Navigate across the whole vault or only within the current folder.").addDropdown(
      (dd) => dd.addOption("vault", "Whole vault").addOption("folder", "Current folder only").setValue(this.plugin.settings.scope).onChange(async (v) => {
        this.plugin.settings.scope = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Wrap around").setDesc("Navigating past the last note goes to the first, and vice versa.").addToggle(
      (t) => t.setValue(this.plugin.settings.wrapAround).onChange(async (v) => {
        this.plugin.settings.wrapAround = v;
        await this.plugin.saveSettings();
      })
    );
  }
};
