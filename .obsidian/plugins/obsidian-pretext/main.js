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
  default: () => ObsidianPretextPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/utils/logger.ts
var Logger = class _Logger {
  constructor(config) {
    this.PREFIX = "[Pretext Optimizer]";
    var _a, _b;
    this.level = (_a = config == null ? void 0 : config.level) != null ? _a : 1 /* INFO */;
    this.enableTimestamp = (_b = config == null ? void 0 : config.enableTimestamp) != null ? _b : true;
    this.stats = {
      logCount: 0,
      warnCount: 0,
      errorCount: 0,
      debugCount: 0
    };
  }
  /**
   * 获取 Logger 单例实例
   */
  static getInstance(config) {
    if (!_Logger.instance) {
      _Logger.instance = new _Logger(config);
    }
    return _Logger.instance;
  }
  /**
   * 格式化日志消息
   */
  formatMessage(message, ...args) {
    let formatted = message;
    if (args.length > 0) {
      formatted += " " + args.map((arg) => {
        if (arg instanceof Error) {
          return `${arg.message}
${arg.stack || ""}`;
        }
        if (typeof arg === "object") {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      }).join(" ");
    }
    return formatted;
  }
  /**
   * 获取时间戳字符串
   */
  getTimestamp() {
    if (!this.enableTimestamp) return "";
    const now = /* @__PURE__ */ new Date();
    return now.toISOString().split("T")[1].slice(0, -1);
  }
  /**
   * 记录调试信息
   */
  debug(message, ...args) {
    if (this.level > 0 /* DEBUG */) return;
    const timestamp = this.getTimestamp();
    const prefix = timestamp ? `[${timestamp}] ${this.PREFIX}` : this.PREFIX;
    console.debug(`${prefix} ${this.formatMessage(message, ...args)}`);
    this.stats.debugCount++;
  }
  /**
   * 记录一般信息
   */
  info(message, ...args) {
    if (this.level > 1 /* INFO */) return;
    const timestamp = this.getTimestamp();
    const prefix = timestamp ? `[${timestamp}] ${this.PREFIX}` : this.PREFIX;
    console.log(`${prefix} ${this.formatMessage(message, ...args)}`);
    this.stats.logCount++;
  }
  /**
   * 记录警告信息
   */
  warn(message, ...args) {
    if (this.level > 2 /* WARN */) return;
    const timestamp = this.getTimestamp();
    const prefix = timestamp ? `[${timestamp}] ${this.PREFIX}` : this.PREFIX;
    console.warn(`${prefix} ${this.formatMessage(message, ...args)}`);
    this.stats.warnCount++;
  }
  /**
   * 记录错误信息
   */
  error(message, ...args) {
    if (this.level > 3 /* ERROR */) return;
    const timestamp = this.getTimestamp();
    const prefix = timestamp ? `[${timestamp}] ${this.PREFIX}` : this.PREFIX;
    console.error(`${prefix} ${this.formatMessage(message, ...args)}`);
    this.stats.errorCount++;
  }
  /**
   * 设置日志级别
   */
  setLevel(level) {
    this.level = level;
  }
  /**
   * 获取日志统计信息
   */
  getStats() {
    return { ...this.stats };
  }
  /**
   * 重置统计信息
   */
  resetStats() {
    this.stats = {
      logCount: 0,
      warnCount: 0,
      errorCount: 0,
      debugCount: 0
    };
  }
  /**
   * 配置日志器
   */
  configure(config) {
    if (config.level !== void 0) {
      this.level = config.level;
    }
    if (config.enableTimestamp !== void 0) {
      this.enableTimestamp = config.enableTimestamp;
    }
  }
};
var ErrorHandler = class _ErrorHandler {
  constructor(maxErrors = 100) {
    this.errors = [];
    this.maxErrors = maxErrors;
  }
  /**
   * 获取 ErrorHandler 单例实例
   */
  static getInstance(maxErrors) {
    if (!_ErrorHandler.instance) {
      _ErrorHandler.instance = new _ErrorHandler(maxErrors);
    }
    return _ErrorHandler.instance;
  }
  /**
   * 处理错误
   */
  handleError(error, context) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    };
    this.errors.push(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
    const contextStr = context ? ` in ${context}` : "";
    const logger2 = Logger.getInstance();
    logger2.error(`Error${contextStr}: ${error.message}`, error.stack);
  }
  /**
   * 获取错误数量
   */
  getErrorCount() {
    return this.errors.length;
  }
  /**
   * 获取所有错误
   */
  getErrors() {
    return [...this.errors];
  }
  /**
   * 清除所有错误
   */
  clearErrors() {
    this.errors = [];
  }
  /**
   * 获取最近的 N 条错误
   */
  getRecentErrors(count = 10) {
    return this.errors.slice(-count);
  }
  /**
   * 获取错误统计
   */
  getErrorStats() {
    const byContext = /* @__PURE__ */ new Map();
    for (const error of this.errors) {
      const context = error.context || "unknown";
      byContext.set(context, (byContext.get(context) || 0) + 1);
    }
    return { total: this.errors.length, byContext };
  }
};
var PerformanceMonitor = class _PerformanceMonitor {
  constructor() {
    this.MAX_SLOW_OPS = 50;
    this.timers = /* @__PURE__ */ new Map();
    this.completedTimers = /* @__PURE__ */ new Map();
    this.slowOperations = [];
  }
  /**
   * 获取 PerformanceMonitor 单例实例
   */
  static getInstance() {
    if (!_PerformanceMonitor.instance) {
      _PerformanceMonitor.instance = new _PerformanceMonitor();
    }
    return _PerformanceMonitor.instance;
  }
  /**
   * 开始计时
   */
  startTimer(name) {
    this.timers.set(name, performance.now());
  }
  /**
   * 结束计时并返回持续时间（毫秒）
   */
  endTimer(name) {
    const startTime = this.timers.get(name);
    if (startTime === void 0) {
      const logger2 = Logger.getInstance();
      logger2.warn(`Timer "${name}" was not started`);
      return 0;
    }
    const duration = performance.now() - startTime;
    this.timers.delete(name);
    this.completedTimers.set(name, duration);
    return duration;
  }
  /**
   * 获取性能指标
   */
  getMetrics() {
    return {
      timers: new Map(this.timers),
      completedTimers: new Map(this.completedTimers),
      slowOperations: [...this.slowOperations]
    };
  }
  /**
   * 记录慢操作
   */
  recordSlowOperation(name, duration) {
    this.slowOperations.push({
      name,
      duration,
      timestamp: Date.now()
    });
    if (this.slowOperations.length > this.MAX_SLOW_OPS) {
      this.slowOperations.shift();
    }
  }
  /**
   * 记录超过阈值的慢操作
   */
  logSlowOperations(threshold = 100) {
    const logger2 = Logger.getInstance();
    const metrics = this.getMetrics();
    for (const [name, duration] of metrics.completedTimers) {
      if (duration > threshold) {
        logger2.warn(`Slow operation detected: "${name}" took ${duration.toFixed(2)}ms`);
        this.recordSlowOperation(name, duration);
      }
    }
  }
  /**
   * 使用计时器包装函数执行
   */
  async measureAsync(name, fn) {
    this.startTimer(name);
    try {
      return await fn();
    } finally {
      const duration = this.endTimer(name);
      if (duration > 100) {
        const logger2 = Logger.getInstance();
        logger2.debug(`[${name}] completed in ${duration.toFixed(2)}ms`);
      }
    }
  }
  /**
   * 同步计时器包装函数执行
   */
  measure(name, fn) {
    this.startTimer(name);
    try {
      return fn();
    } finally {
      const duration = this.endTimer(name);
      if (duration > 100) {
        const logger2 = Logger.getInstance();
        logger2.debug(`[${name}] completed in ${duration.toFixed(2)}ms`);
      }
    }
  }
  /**
   * 获取活跃计时器列表
   */
  getActiveTimers() {
    return Array.from(this.timers.keys());
  }
  /**
   * 获取已完成的计时器统计
   */
  getCompletedTimerStats() {
    const stats = /* @__PURE__ */ new Map();
    for (const [name, duration] of this.completedTimers) {
      const existing = stats.get(name) || { total: 0, count: 0 };
      existing.total += duration;
      existing.count += 1;
      stats.set(name, existing);
    }
    return Array.from(stats.entries()).map(([name, data]) => ({
      name,
      avgDuration: data.total / data.count,
      count: data.count
    }));
  }
  /**
   * 清除所有计时器和慢操作记录
   */
  reset() {
    this.timers.clear();
    this.completedTimers.clear();
    this.slowOperations = [];
  }
};
var defaultConfig = {
  level: 1 /* INFO */,
  enableTimestamp: true,
  enablePerformanceMonitoring: true
};
var logger = Logger.getInstance(defaultConfig);
var errorHandler = ErrorHandler.getInstance();
var performanceMonitor = PerformanceMonitor.getInstance();

// lib/pretext/bidi.js
var baseTypes = [
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "S",
  "B",
  "S",
  "WS",
  "B",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "B",
  "B",
  "B",
  "S",
  "WS",
  "ON",
  "ON",
  "ET",
  "ET",
  "ET",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "CS",
  "ON",
  "CS",
  "ON",
  "EN",
  "EN",
  "EN",
  "EN",
  "EN",
  "EN",
  "EN",
  "EN",
  "EN",
  "EN",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "ON",
  "ON",
  "ON",
  "ON",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "B",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "CS",
  "ON",
  "ET",
  "ET",
  "ET",
  "ET",
  "ON",
  "ON",
  "ON",
  "ON",
  "L",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "ET",
  "ET",
  "EN",
  "EN",
  "ON",
  "L",
  "ON",
  "ON",
  "ON",
  "EN",
  "L",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "ON",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "ON",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L"
];
var arabicTypes = [
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "CS",
  "AL",
  "ON",
  "ON",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AN",
  "AN",
  "AN",
  "AN",
  "AN",
  "AN",
  "AN",
  "AN",
  "AN",
  "AN",
  "ET",
  "AN",
  "AN",
  "AL",
  "AL",
  "AL",
  "NSM",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "ON",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL"
];
function classifyChar(charCode) {
  if (charCode <= 255)
    return baseTypes[charCode];
  if (1424 <= charCode && charCode <= 1524)
    return "R";
  if (1536 <= charCode && charCode <= 1791)
    return arabicTypes[charCode & 255];
  if (1792 <= charCode && charCode <= 2220)
    return "AL";
  return "L";
}
function computeBidiLevels(str) {
  const len = str.length;
  if (len === 0)
    return null;
  const types = new Array(len);
  let numBidi = 0;
  for (let i = 0; i < len; i++) {
    const t = classifyChar(str.charCodeAt(i));
    if (t === "R" || t === "AL" || t === "AN")
      numBidi++;
    types[i] = t;
  }
  if (numBidi === 0)
    return null;
  const startLevel = len / numBidi < 0.3 ? 0 : 1;
  const levels = new Int8Array(len);
  for (let i = 0; i < len; i++)
    levels[i] = startLevel;
  const e = startLevel & 1 ? "R" : "L";
  const sor = e;
  let lastType = sor;
  for (let i = 0; i < len; i++) {
    if (types[i] === "NSM")
      types[i] = lastType;
    else
      lastType = types[i];
  }
  lastType = sor;
  for (let i = 0; i < len; i++) {
    const t = types[i];
    if (t === "EN")
      types[i] = lastType === "AL" ? "AN" : "EN";
    else if (t === "R" || t === "L" || t === "AL")
      lastType = t;
  }
  for (let i = 0; i < len; i++) {
    if (types[i] === "AL")
      types[i] = "R";
  }
  for (let i = 1; i < len - 1; i++) {
    if (types[i] === "ES" && types[i - 1] === "EN" && types[i + 1] === "EN") {
      types[i] = "EN";
    }
    if (types[i] === "CS" && (types[i - 1] === "EN" || types[i - 1] === "AN") && types[i + 1] === types[i - 1]) {
      types[i] = types[i - 1];
    }
  }
  for (let i = 0; i < len; i++) {
    if (types[i] !== "EN")
      continue;
    let j;
    for (j = i - 1; j >= 0 && types[j] === "ET"; j--)
      types[j] = "EN";
    for (j = i + 1; j < len && types[j] === "ET"; j++)
      types[j] = "EN";
  }
  for (let i = 0; i < len; i++) {
    const t = types[i];
    if (t === "WS" || t === "ES" || t === "ET" || t === "CS")
      types[i] = "ON";
  }
  lastType = sor;
  for (let i = 0; i < len; i++) {
    const t = types[i];
    if (t === "EN")
      types[i] = lastType === "L" ? "L" : "EN";
    else if (t === "R" || t === "L")
      lastType = t;
  }
  for (let i = 0; i < len; i++) {
    if (types[i] !== "ON")
      continue;
    let end = i + 1;
    while (end < len && types[end] === "ON")
      end++;
    const before = i > 0 ? types[i - 1] : sor;
    const after = end < len ? types[end] : sor;
    const bDir = before !== "L" ? "R" : "L";
    const aDir = after !== "L" ? "R" : "L";
    if (bDir === aDir) {
      for (let j = i; j < end; j++)
        types[j] = bDir;
    }
    i = end - 1;
  }
  for (let i = 0; i < len; i++) {
    if (types[i] === "ON")
      types[i] = e;
  }
  for (let i = 0; i < len; i++) {
    const t = types[i];
    if ((levels[i] & 1) === 0) {
      if (t === "R")
        levels[i]++;
      else if (t === "AN" || t === "EN")
        levels[i] += 2;
    } else if (t === "L" || t === "AN" || t === "EN") {
      levels[i]++;
    }
  }
  return levels;
}
function computeSegmentLevels(normalized, segStarts) {
  const bidiLevels = computeBidiLevels(normalized);
  if (bidiLevels === null)
    return null;
  const segLevels = new Int8Array(segStarts.length);
  for (let i = 0; i < segStarts.length; i++) {
    segLevels[i] = bidiLevels[segStarts[i]];
  }
  return segLevels;
}

// lib/pretext/analysis.js
var collapsibleWhitespaceRunRe = /[ \t\n\r\f]+/g;
var needsWhitespaceNormalizationRe = /[\t\n\r\f]| {2,}|^ | $/;
function getWhiteSpaceProfile(whiteSpace) {
  const mode = whiteSpace != null ? whiteSpace : "normal";
  return mode === "pre-wrap" ? { mode, preserveOrdinarySpaces: true, preserveHardBreaks: true } : { mode, preserveOrdinarySpaces: false, preserveHardBreaks: false };
}
function normalizeWhitespaceNormal(text) {
  if (!needsWhitespaceNormalizationRe.test(text))
    return text;
  let normalized = text.replace(collapsibleWhitespaceRunRe, " ");
  if (normalized.charCodeAt(0) === 32) {
    normalized = normalized.slice(1);
  }
  if (normalized.length > 0 && normalized.charCodeAt(normalized.length - 1) === 32) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}
function normalizeWhitespacePreWrap(text) {
  if (!/[\r\f]/.test(text))
    return text.replace(/\r\n/g, "\n");
  return text.replace(/\r\n/g, "\n").replace(/[\r\f]/g, "\n");
}
var sharedWordSegmenter = null;
var segmenterLocale;
function getSharedWordSegmenter() {
  if (sharedWordSegmenter === null) {
    sharedWordSegmenter = new Intl.Segmenter(segmenterLocale, { granularity: "word" });
  }
  return sharedWordSegmenter;
}
function clearAnalysisCaches() {
  sharedWordSegmenter = null;
}
var arabicScriptRe = /\p{Script=Arabic}/u;
var combiningMarkRe = /\p{M}/u;
var decimalDigitRe = /\p{Nd}/u;
function containsArabicScript(text) {
  return arabicScriptRe.test(text);
}
function isCJK(s) {
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c >= 19968 && c <= 40959 || c >= 13312 && c <= 19903 || c >= 131072 && c <= 173791 || c >= 173824 && c <= 177983 || c >= 177984 && c <= 178207 || c >= 178208 && c <= 183983 || c >= 183984 && c <= 191471 || c >= 196608 && c <= 201551 || c >= 63744 && c <= 64255 || c >= 194560 && c <= 195103 || c >= 12288 && c <= 12351 || c >= 12352 && c <= 12447 || c >= 12448 && c <= 12543 || c >= 44032 && c <= 55215 || c >= 65280 && c <= 65519) {
      return true;
    }
  }
  return false;
}
var kinsokuStart = /* @__PURE__ */ new Set([
  "\uFF0C",
  "\uFF0E",
  "\uFF01",
  "\uFF1A",
  "\uFF1B",
  "\uFF1F",
  "\u3001",
  "\u3002",
  "\u30FB",
  "\uFF09",
  "\u3015",
  "\u3009",
  "\u300B",
  "\u300D",
  "\u300F",
  "\u3011",
  "\u3017",
  "\u3019",
  "\u301B",
  "\u30FC",
  "\u3005",
  "\u303B",
  "\u309D",
  "\u309E",
  "\u30FD",
  "\u30FE"
]);
var kinsokuEnd = /* @__PURE__ */ new Set([
  '"',
  "(",
  "[",
  "{",
  "\u201C",
  "\u2018",
  "\xAB",
  "\u2039",
  "\uFF08",
  "\u3014",
  "\u3008",
  "\u300A",
  "\u300C",
  "\u300E",
  "\u3010",
  "\u3016",
  "\u3018",
  "\u301A"
]);
var forwardStickyGlue = /* @__PURE__ */ new Set([
  "'",
  "\u2019"
]);
var leftStickyPunctuation = /* @__PURE__ */ new Set([
  ".",
  ",",
  "!",
  "?",
  ":",
  ";",
  "\u060C",
  "\u061B",
  "\u061F",
  "\u0964",
  "\u0965",
  "\u104A",
  "\u104B",
  "\u104C",
  "\u104D",
  "\u104F",
  ")",
  "]",
  "}",
  "%",
  '"',
  "\u201D",
  "\u2019",
  "\xBB",
  "\u203A",
  "\u2026"
]);
var arabicNoSpaceTrailingPunctuation = /* @__PURE__ */ new Set([
  ":",
  ".",
  "\u060C",
  "\u061B"
]);
var myanmarMedialGlue = /* @__PURE__ */ new Set([
  "\u104F"
]);
var closingQuoteChars = /* @__PURE__ */ new Set([
  "\u201D",
  "\u2019",
  "\xBB",
  "\u203A",
  "\u300D",
  "\u300F",
  "\u3011",
  "\u300B",
  "\u3009",
  "\u3015",
  "\uFF09"
]);
function isLeftStickyPunctuationSegment(segment) {
  if (isEscapedQuoteClusterSegment(segment))
    return true;
  let sawPunctuation = false;
  for (const ch of segment) {
    if (leftStickyPunctuation.has(ch)) {
      sawPunctuation = true;
      continue;
    }
    if (sawPunctuation && combiningMarkRe.test(ch))
      continue;
    return false;
  }
  return sawPunctuation;
}
function isCJKLineStartProhibitedSegment(segment) {
  for (const ch of segment) {
    if (!kinsokuStart.has(ch) && !leftStickyPunctuation.has(ch))
      return false;
  }
  return segment.length > 0;
}
function isForwardStickyClusterSegment(segment) {
  if (isEscapedQuoteClusterSegment(segment))
    return true;
  for (const ch of segment) {
    if (!kinsokuEnd.has(ch) && !forwardStickyGlue.has(ch) && !combiningMarkRe.test(ch))
      return false;
  }
  return segment.length > 0;
}
function isEscapedQuoteClusterSegment(segment) {
  let sawQuote = false;
  for (const ch of segment) {
    if (ch === "\\" || combiningMarkRe.test(ch))
      continue;
    if (kinsokuEnd.has(ch) || leftStickyPunctuation.has(ch) || forwardStickyGlue.has(ch)) {
      sawQuote = true;
      continue;
    }
    return false;
  }
  return sawQuote;
}
function splitTrailingForwardStickyCluster(text) {
  const chars = Array.from(text);
  let splitIndex = chars.length;
  while (splitIndex > 0) {
    const ch = chars[splitIndex - 1];
    if (combiningMarkRe.test(ch)) {
      splitIndex--;
      continue;
    }
    if (kinsokuEnd.has(ch) || forwardStickyGlue.has(ch)) {
      splitIndex--;
      continue;
    }
    break;
  }
  if (splitIndex <= 0 || splitIndex === chars.length)
    return null;
  return {
    head: chars.slice(0, splitIndex).join(""),
    tail: chars.slice(splitIndex).join("")
  };
}
function isRepeatedSingleCharRun(segment, ch) {
  if (segment.length === 0)
    return false;
  for (const part of segment) {
    if (part !== ch)
      return false;
  }
  return true;
}
function endsWithArabicNoSpacePunctuation(segment) {
  if (!containsArabicScript(segment) || segment.length === 0)
    return false;
  return arabicNoSpaceTrailingPunctuation.has(segment[segment.length - 1]);
}
function endsWithMyanmarMedialGlue(segment) {
  if (segment.length === 0)
    return false;
  return myanmarMedialGlue.has(segment[segment.length - 1]);
}
function splitLeadingSpaceAndMarks(segment) {
  if (segment.length < 2 || segment[0] !== " ")
    return null;
  const marks = segment.slice(1);
  if (/^\p{M}+$/u.test(marks)) {
    return { space: " ", marks };
  }
  return null;
}
function endsWithClosingQuote(text) {
  for (let i = text.length - 1; i >= 0; i--) {
    const ch = text[i];
    if (closingQuoteChars.has(ch))
      return true;
    if (!leftStickyPunctuation.has(ch))
      return false;
  }
  return false;
}
function classifySegmentBreakChar(ch, whiteSpaceProfile) {
  if (whiteSpaceProfile.preserveOrdinarySpaces || whiteSpaceProfile.preserveHardBreaks) {
    if (ch === " ")
      return "preserved-space";
    if (ch === "	")
      return "tab";
    if (whiteSpaceProfile.preserveHardBreaks && ch === "\n")
      return "hard-break";
  }
  if (ch === " ")
    return "space";
  if (ch === "\xA0" || ch === "\u202F" || ch === "\u2060" || ch === "\uFEFF") {
    return "glue";
  }
  if (ch === "\u200B")
    return "zero-width-break";
  if (ch === "\xAD")
    return "soft-hyphen";
  return "text";
}
function splitSegmentByBreakKind(segment, isWordLike, start, whiteSpaceProfile) {
  const pieces = [];
  let currentKind = null;
  let currentText = "";
  let currentStart = start;
  let currentWordLike = false;
  let offset = 0;
  for (const ch of segment) {
    const kind = classifySegmentBreakChar(ch, whiteSpaceProfile);
    const wordLike = kind === "text" && isWordLike;
    if (currentKind !== null && kind === currentKind && wordLike === currentWordLike) {
      currentText += ch;
      offset += ch.length;
      continue;
    }
    if (currentKind !== null) {
      pieces.push({
        text: currentText,
        isWordLike: currentWordLike,
        kind: currentKind,
        start: currentStart
      });
    }
    currentKind = kind;
    currentText = ch;
    currentStart = start + offset;
    currentWordLike = wordLike;
    offset += ch.length;
  }
  if (currentKind !== null) {
    pieces.push({
      text: currentText,
      isWordLike: currentWordLike,
      kind: currentKind,
      start: currentStart
    });
  }
  return pieces;
}
function isTextRunBoundary(kind) {
  return kind === "space" || kind === "preserved-space" || kind === "zero-width-break" || kind === "hard-break";
}
var urlSchemeSegmentRe = /^[A-Za-z][A-Za-z0-9+.-]*:$/;
function isUrlLikeRunStart(segmentation, index) {
  const text = segmentation.texts[index];
  if (text.startsWith("www."))
    return true;
  return urlSchemeSegmentRe.test(text) && index + 1 < segmentation.len && segmentation.kinds[index + 1] === "text" && segmentation.texts[index + 1] === "//";
}
function isUrlQueryBoundarySegment(text) {
  return text.includes("?") && (text.includes("://") || text.startsWith("www."));
}
function mergeUrlLikeRuns(segmentation) {
  const texts = segmentation.texts.slice();
  const isWordLike = segmentation.isWordLike.slice();
  const kinds = segmentation.kinds.slice();
  const starts = segmentation.starts.slice();
  for (let i = 0; i < segmentation.len; i++) {
    if (kinds[i] !== "text" || !isUrlLikeRunStart(segmentation, i))
      continue;
    let j = i + 1;
    while (j < segmentation.len && !isTextRunBoundary(kinds[j])) {
      texts[i] += texts[j];
      isWordLike[i] = true;
      const endsQueryPrefix = texts[j].includes("?");
      kinds[j] = "text";
      texts[j] = "";
      j++;
      if (endsQueryPrefix)
        break;
    }
  }
  let compactLen = 0;
  for (let read = 0; read < texts.length; read++) {
    const text = texts[read];
    if (text.length === 0)
      continue;
    if (compactLen !== read) {
      texts[compactLen] = text;
      isWordLike[compactLen] = isWordLike[read];
      kinds[compactLen] = kinds[read];
      starts[compactLen] = starts[read];
    }
    compactLen++;
  }
  texts.length = compactLen;
  isWordLike.length = compactLen;
  kinds.length = compactLen;
  starts.length = compactLen;
  return {
    len: compactLen,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function mergeUrlQueryRuns(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  for (let i = 0; i < segmentation.len; i++) {
    const text = segmentation.texts[i];
    texts.push(text);
    isWordLike.push(segmentation.isWordLike[i]);
    kinds.push(segmentation.kinds[i]);
    starts.push(segmentation.starts[i]);
    if (!isUrlQueryBoundarySegment(text))
      continue;
    const nextIndex = i + 1;
    if (nextIndex >= segmentation.len || isTextRunBoundary(segmentation.kinds[nextIndex])) {
      continue;
    }
    let queryText = "";
    const queryStart = segmentation.starts[nextIndex];
    let j = nextIndex;
    while (j < segmentation.len && !isTextRunBoundary(segmentation.kinds[j])) {
      queryText += segmentation.texts[j];
      j++;
    }
    if (queryText.length > 0) {
      texts.push(queryText);
      isWordLike.push(true);
      kinds.push("text");
      starts.push(queryStart);
      i = j - 1;
    }
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
var numericJoinerChars = /* @__PURE__ */ new Set([
  ":",
  "-",
  "/",
  "\xD7",
  ",",
  ".",
  "+",
  "\u2013",
  "\u2014"
]);
var asciiPunctuationChainSegmentRe = /^[A-Za-z0-9_]+[,:;]*$/;
var asciiPunctuationChainTrailingJoinersRe = /[,:;]+$/;
function segmentContainsDecimalDigit(text) {
  for (const ch of text) {
    if (decimalDigitRe.test(ch))
      return true;
  }
  return false;
}
function isNumericRunSegment(text) {
  if (text.length === 0)
    return false;
  for (const ch of text) {
    if (decimalDigitRe.test(ch) || numericJoinerChars.has(ch))
      continue;
    return false;
  }
  return true;
}
function mergeNumericRuns(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  for (let i = 0; i < segmentation.len; i++) {
    const text = segmentation.texts[i];
    const kind = segmentation.kinds[i];
    if (kind === "text" && isNumericRunSegment(text) && segmentContainsDecimalDigit(text)) {
      let mergedText = text;
      let j = i + 1;
      while (j < segmentation.len && segmentation.kinds[j] === "text" && isNumericRunSegment(segmentation.texts[j])) {
        mergedText += segmentation.texts[j];
        j++;
      }
      texts.push(mergedText);
      isWordLike.push(true);
      kinds.push("text");
      starts.push(segmentation.starts[i]);
      i = j - 1;
      continue;
    }
    texts.push(text);
    isWordLike.push(segmentation.isWordLike[i]);
    kinds.push(kind);
    starts.push(segmentation.starts[i]);
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function mergeAsciiPunctuationChains(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  for (let i = 0; i < segmentation.len; i++) {
    const text = segmentation.texts[i];
    const kind = segmentation.kinds[i];
    const wordLike = segmentation.isWordLike[i];
    if (kind === "text" && wordLike && asciiPunctuationChainSegmentRe.test(text)) {
      let mergedText = text;
      let j = i + 1;
      while (asciiPunctuationChainTrailingJoinersRe.test(mergedText) && j < segmentation.len && segmentation.kinds[j] === "text" && segmentation.isWordLike[j] && asciiPunctuationChainSegmentRe.test(segmentation.texts[j])) {
        mergedText += segmentation.texts[j];
        j++;
      }
      texts.push(mergedText);
      isWordLike.push(true);
      kinds.push("text");
      starts.push(segmentation.starts[i]);
      i = j - 1;
      continue;
    }
    texts.push(text);
    isWordLike.push(wordLike);
    kinds.push(kind);
    starts.push(segmentation.starts[i]);
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function splitHyphenatedNumericRuns(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  for (let i = 0; i < segmentation.len; i++) {
    const text = segmentation.texts[i];
    if (segmentation.kinds[i] === "text" && text.includes("-")) {
      const parts = text.split("-");
      let shouldSplit = parts.length > 1;
      for (let j = 0; j < parts.length; j++) {
        const part = parts[j];
        if (!shouldSplit)
          break;
        if (part.length === 0 || !segmentContainsDecimalDigit(part) || !isNumericRunSegment(part)) {
          shouldSplit = false;
        }
      }
      if (shouldSplit) {
        let offset = 0;
        for (let j = 0; j < parts.length; j++) {
          const part = parts[j];
          const splitText = j < parts.length - 1 ? `${part}-` : part;
          texts.push(splitText);
          isWordLike.push(true);
          kinds.push("text");
          starts.push(segmentation.starts[i] + offset);
          offset += splitText.length;
        }
        continue;
      }
    }
    texts.push(text);
    isWordLike.push(segmentation.isWordLike[i]);
    kinds.push(segmentation.kinds[i]);
    starts.push(segmentation.starts[i]);
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function mergeGlueConnectedTextRuns(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  let read = 0;
  while (read < segmentation.len) {
    let text = segmentation.texts[read];
    let wordLike = segmentation.isWordLike[read];
    let kind = segmentation.kinds[read];
    let start = segmentation.starts[read];
    if (kind === "glue") {
      let glueText = text;
      const glueStart = start;
      read++;
      while (read < segmentation.len && segmentation.kinds[read] === "glue") {
        glueText += segmentation.texts[read];
        read++;
      }
      if (read < segmentation.len && segmentation.kinds[read] === "text") {
        text = glueText + segmentation.texts[read];
        wordLike = segmentation.isWordLike[read];
        kind = "text";
        start = glueStart;
        read++;
      } else {
        texts.push(glueText);
        isWordLike.push(false);
        kinds.push("glue");
        starts.push(glueStart);
        continue;
      }
    } else {
      read++;
    }
    if (kind === "text") {
      while (read < segmentation.len && segmentation.kinds[read] === "glue") {
        let glueText = "";
        while (read < segmentation.len && segmentation.kinds[read] === "glue") {
          glueText += segmentation.texts[read];
          read++;
        }
        if (read < segmentation.len && segmentation.kinds[read] === "text") {
          text += glueText + segmentation.texts[read];
          wordLike = wordLike || segmentation.isWordLike[read];
          read++;
          continue;
        }
        text += glueText;
      }
    }
    texts.push(text);
    isWordLike.push(wordLike);
    kinds.push(kind);
    starts.push(start);
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function carryTrailingForwardStickyAcrossCJKBoundary(segmentation) {
  const texts = segmentation.texts.slice();
  const isWordLike = segmentation.isWordLike.slice();
  const kinds = segmentation.kinds.slice();
  const starts = segmentation.starts.slice();
  for (let i = 0; i < texts.length - 1; i++) {
    if (kinds[i] !== "text" || kinds[i + 1] !== "text")
      continue;
    if (!isCJK(texts[i]) || !isCJK(texts[i + 1]))
      continue;
    const split = splitTrailingForwardStickyCluster(texts[i]);
    if (split === null)
      continue;
    texts[i] = split.head;
    texts[i + 1] = split.tail + texts[i + 1];
    starts[i + 1] = starts[i] + split.head.length;
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function buildMergedSegmentation(normalized, profile, whiteSpaceProfile) {
  var _a;
  const wordSegmenter = getSharedWordSegmenter();
  let mergedLen = 0;
  const mergedTexts = [];
  const mergedWordLike = [];
  const mergedKinds = [];
  const mergedStarts = [];
  for (const s of wordSegmenter.segment(normalized)) {
    for (const piece of splitSegmentByBreakKind(s.segment, (_a = s.isWordLike) != null ? _a : false, s.index, whiteSpaceProfile)) {
      const isText = piece.kind === "text";
      if (profile.carryCJKAfterClosingQuote && isText && mergedLen > 0 && mergedKinds[mergedLen - 1] === "text" && isCJK(piece.text) && isCJK(mergedTexts[mergedLen - 1]) && endsWithClosingQuote(mergedTexts[mergedLen - 1])) {
        mergedTexts[mergedLen - 1] += piece.text;
        mergedWordLike[mergedLen - 1] = mergedWordLike[mergedLen - 1] || piece.isWordLike;
      } else if (isText && mergedLen > 0 && mergedKinds[mergedLen - 1] === "text" && isCJKLineStartProhibitedSegment(piece.text) && isCJK(mergedTexts[mergedLen - 1])) {
        mergedTexts[mergedLen - 1] += piece.text;
        mergedWordLike[mergedLen - 1] = mergedWordLike[mergedLen - 1] || piece.isWordLike;
      } else if (isText && mergedLen > 0 && mergedKinds[mergedLen - 1] === "text" && endsWithMyanmarMedialGlue(mergedTexts[mergedLen - 1])) {
        mergedTexts[mergedLen - 1] += piece.text;
        mergedWordLike[mergedLen - 1] = mergedWordLike[mergedLen - 1] || piece.isWordLike;
      } else if (isText && mergedLen > 0 && mergedKinds[mergedLen - 1] === "text" && piece.isWordLike && containsArabicScript(piece.text) && endsWithArabicNoSpacePunctuation(mergedTexts[mergedLen - 1])) {
        mergedTexts[mergedLen - 1] += piece.text;
        mergedWordLike[mergedLen - 1] = true;
      } else if (isText && !piece.isWordLike && mergedLen > 0 && mergedKinds[mergedLen - 1] === "text" && piece.text.length === 1 && piece.text !== "-" && piece.text !== "\u2014" && isRepeatedSingleCharRun(mergedTexts[mergedLen - 1], piece.text)) {
        mergedTexts[mergedLen - 1] += piece.text;
      } else if (isText && !piece.isWordLike && mergedLen > 0 && mergedKinds[mergedLen - 1] === "text" && (isLeftStickyPunctuationSegment(piece.text) || piece.text === "-" && mergedWordLike[mergedLen - 1])) {
        mergedTexts[mergedLen - 1] += piece.text;
      } else {
        mergedTexts[mergedLen] = piece.text;
        mergedWordLike[mergedLen] = piece.isWordLike;
        mergedKinds[mergedLen] = piece.kind;
        mergedStarts[mergedLen] = piece.start;
        mergedLen++;
      }
    }
  }
  for (let i = 1; i < mergedLen; i++) {
    if (mergedKinds[i] === "text" && !mergedWordLike[i] && isEscapedQuoteClusterSegment(mergedTexts[i]) && mergedKinds[i - 1] === "text") {
      mergedTexts[i - 1] += mergedTexts[i];
      mergedWordLike[i - 1] = mergedWordLike[i - 1] || mergedWordLike[i];
      mergedTexts[i] = "";
    }
  }
  for (let i = mergedLen - 2; i >= 0; i--) {
    if (mergedKinds[i] === "text" && !mergedWordLike[i] && isForwardStickyClusterSegment(mergedTexts[i])) {
      let j = i + 1;
      while (j < mergedLen && mergedTexts[j] === "")
        j++;
      if (j < mergedLen && mergedKinds[j] === "text") {
        mergedTexts[j] = mergedTexts[i] + mergedTexts[j];
        mergedStarts[j] = mergedStarts[i];
        mergedTexts[i] = "";
      }
    }
  }
  let compactLen = 0;
  for (let read = 0; read < mergedLen; read++) {
    const text = mergedTexts[read];
    if (text.length === 0)
      continue;
    if (compactLen !== read) {
      mergedTexts[compactLen] = text;
      mergedWordLike[compactLen] = mergedWordLike[read];
      mergedKinds[compactLen] = mergedKinds[read];
      mergedStarts[compactLen] = mergedStarts[read];
    }
    compactLen++;
  }
  mergedTexts.length = compactLen;
  mergedWordLike.length = compactLen;
  mergedKinds.length = compactLen;
  mergedStarts.length = compactLen;
  const compacted = mergeGlueConnectedTextRuns({
    len: compactLen,
    texts: mergedTexts,
    isWordLike: mergedWordLike,
    kinds: mergedKinds,
    starts: mergedStarts
  });
  const withMergedUrls = carryTrailingForwardStickyAcrossCJKBoundary(mergeAsciiPunctuationChains(splitHyphenatedNumericRuns(mergeNumericRuns(mergeUrlQueryRuns(mergeUrlLikeRuns(compacted))))));
  for (let i = 0; i < withMergedUrls.len - 1; i++) {
    const split = splitLeadingSpaceAndMarks(withMergedUrls.texts[i]);
    if (split === null)
      continue;
    if (withMergedUrls.kinds[i] !== "space" && withMergedUrls.kinds[i] !== "preserved-space" || withMergedUrls.kinds[i + 1] !== "text" || !containsArabicScript(withMergedUrls.texts[i + 1])) {
      continue;
    }
    withMergedUrls.texts[i] = split.space;
    withMergedUrls.isWordLike[i] = false;
    withMergedUrls.kinds[i] = withMergedUrls.kinds[i] === "preserved-space" ? "preserved-space" : "space";
    withMergedUrls.texts[i + 1] = split.marks + withMergedUrls.texts[i + 1];
    withMergedUrls.starts[i + 1] = withMergedUrls.starts[i] + split.space.length;
  }
  return withMergedUrls;
}
function compileAnalysisChunks(segmentation, whiteSpaceProfile) {
  if (segmentation.len === 0)
    return [];
  if (!whiteSpaceProfile.preserveHardBreaks) {
    return [{
      startSegmentIndex: 0,
      endSegmentIndex: segmentation.len,
      consumedEndSegmentIndex: segmentation.len
    }];
  }
  const chunks = [];
  let startSegmentIndex = 0;
  for (let i = 0; i < segmentation.len; i++) {
    if (segmentation.kinds[i] !== "hard-break")
      continue;
    chunks.push({
      startSegmentIndex,
      endSegmentIndex: i,
      consumedEndSegmentIndex: i + 1
    });
    startSegmentIndex = i + 1;
  }
  if (startSegmentIndex < segmentation.len) {
    chunks.push({
      startSegmentIndex,
      endSegmentIndex: segmentation.len,
      consumedEndSegmentIndex: segmentation.len
    });
  }
  return chunks;
}
function analyzeText(text, profile, whiteSpace = "normal") {
  const whiteSpaceProfile = getWhiteSpaceProfile(whiteSpace);
  const normalized = whiteSpaceProfile.mode === "pre-wrap" ? normalizeWhitespacePreWrap(text) : normalizeWhitespaceNormal(text);
  if (normalized.length === 0) {
    return {
      normalized,
      chunks: [],
      len: 0,
      texts: [],
      isWordLike: [],
      kinds: [],
      starts: []
    };
  }
  const segmentation = buildMergedSegmentation(normalized, profile, whiteSpaceProfile);
  return {
    normalized,
    chunks: compileAnalysisChunks(segmentation, whiteSpaceProfile),
    ...segmentation
  };
}

// lib/pretext/measurement.js
var measureContext = null;
var segmentMetricCaches = /* @__PURE__ */ new Map();
var cachedEngineProfile = null;
var emojiPresentationRe = /\p{Emoji_Presentation}/u;
var maybeEmojiRe = /[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u20E3]/u;
var sharedGraphemeSegmenter = null;
var emojiCorrectionCache = /* @__PURE__ */ new Map();
function getMeasureContext() {
  if (measureContext !== null)
    return measureContext;
  if (typeof OffscreenCanvas !== "undefined") {
    measureContext = new OffscreenCanvas(1, 1).getContext("2d");
    return measureContext;
  }
  if (typeof document !== "undefined") {
    measureContext = document.createElement("canvas").getContext("2d");
    return measureContext;
  }
  throw new Error("Text measurement requires OffscreenCanvas or a DOM canvas context.");
}
function getSegmentMetricCache(font) {
  let cache = segmentMetricCaches.get(font);
  if (!cache) {
    cache = /* @__PURE__ */ new Map();
    segmentMetricCaches.set(font, cache);
  }
  return cache;
}
function getSegmentMetrics(seg, cache) {
  let metrics = cache.get(seg);
  if (metrics === void 0) {
    const ctx = getMeasureContext();
    metrics = {
      width: ctx.measureText(seg).width,
      containsCJK: isCJK(seg)
    };
    cache.set(seg, metrics);
  }
  return metrics;
}
function getEngineProfile() {
  if (cachedEngineProfile !== null)
    return cachedEngineProfile;
  if (typeof navigator === "undefined") {
    cachedEngineProfile = {
      lineFitEpsilon: 5e-3,
      carryCJKAfterClosingQuote: false,
      preferPrefixWidthsForBreakableRuns: false,
      preferEarlySoftHyphenBreak: false
    };
    return cachedEngineProfile;
  }
  const ua = navigator.userAgent;
  const vendor = navigator.vendor;
  const isSafari = vendor === "Apple Computer, Inc." && ua.includes("Safari/") && !ua.includes("Chrome/") && !ua.includes("Chromium/") && !ua.includes("CriOS/") && !ua.includes("FxiOS/") && !ua.includes("EdgiOS/");
  const isChromium = ua.includes("Chrome/") || ua.includes("Chromium/") || ua.includes("CriOS/") || ua.includes("Edg/");
  cachedEngineProfile = {
    lineFitEpsilon: isSafari ? 1 / 64 : 5e-3,
    carryCJKAfterClosingQuote: isChromium,
    preferPrefixWidthsForBreakableRuns: isSafari,
    preferEarlySoftHyphenBreak: isSafari
  };
  return cachedEngineProfile;
}
function parseFontSize(font) {
  const m = font.match(/(\d+(?:\.\d+)?)\s*px/);
  return m ? parseFloat(m[1]) : 16;
}
function getSharedGraphemeSegmenter() {
  if (sharedGraphemeSegmenter === null) {
    sharedGraphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
  }
  return sharedGraphemeSegmenter;
}
function isEmojiGrapheme(g) {
  return emojiPresentationRe.test(g) || g.includes("\uFE0F");
}
function textMayContainEmoji(text) {
  return maybeEmojiRe.test(text);
}
function getEmojiCorrection(font, fontSize) {
  let correction = emojiCorrectionCache.get(font);
  if (correction !== void 0)
    return correction;
  const ctx = getMeasureContext();
  ctx.font = font;
  const canvasW = ctx.measureText("\u{1F600}").width;
  correction = 0;
  if (canvasW > fontSize + 0.5 && typeof document !== "undefined" && document.body !== null) {
    const span = document.createElement("span");
    span.style.font = font;
    span.style.display = "inline-block";
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.textContent = "\u{1F600}";
    document.body.appendChild(span);
    const domW = span.getBoundingClientRect().width;
    document.body.removeChild(span);
    if (canvasW - domW > 0.5) {
      correction = canvasW - domW;
    }
  }
  emojiCorrectionCache.set(font, correction);
  return correction;
}
function countEmojiGraphemes(text) {
  let count = 0;
  const graphemeSegmenter = getSharedGraphemeSegmenter();
  for (const g of graphemeSegmenter.segment(text)) {
    if (isEmojiGrapheme(g.segment))
      count++;
  }
  return count;
}
function getEmojiCount(seg, metrics) {
  if (metrics.emojiCount === void 0) {
    metrics.emojiCount = countEmojiGraphemes(seg);
  }
  return metrics.emojiCount;
}
function getCorrectedSegmentWidth(seg, metrics, emojiCorrection) {
  if (emojiCorrection === 0)
    return metrics.width;
  return metrics.width - getEmojiCount(seg, metrics) * emojiCorrection;
}
function getSegmentGraphemeWidths(seg, metrics, cache, emojiCorrection) {
  if (metrics.graphemeWidths !== void 0)
    return metrics.graphemeWidths;
  const widths = [];
  const graphemeSegmenter = getSharedGraphemeSegmenter();
  for (const gs of graphemeSegmenter.segment(seg)) {
    const graphemeMetrics = getSegmentMetrics(gs.segment, cache);
    widths.push(getCorrectedSegmentWidth(gs.segment, graphemeMetrics, emojiCorrection));
  }
  metrics.graphemeWidths = widths.length > 1 ? widths : null;
  return metrics.graphemeWidths;
}
function getSegmentGraphemePrefixWidths(seg, metrics, cache, emojiCorrection) {
  if (metrics.graphemePrefixWidths !== void 0)
    return metrics.graphemePrefixWidths;
  const prefixWidths = [];
  const graphemeSegmenter = getSharedGraphemeSegmenter();
  let prefix = "";
  for (const gs of graphemeSegmenter.segment(seg)) {
    prefix += gs.segment;
    const prefixMetrics = getSegmentMetrics(prefix, cache);
    prefixWidths.push(getCorrectedSegmentWidth(prefix, prefixMetrics, emojiCorrection));
  }
  metrics.graphemePrefixWidths = prefixWidths.length > 1 ? prefixWidths : null;
  return metrics.graphemePrefixWidths;
}
function getFontMeasurementState(font, needsEmojiCorrection) {
  const ctx = getMeasureContext();
  ctx.font = font;
  const cache = getSegmentMetricCache(font);
  const fontSize = parseFontSize(font);
  const emojiCorrection = needsEmojiCorrection ? getEmojiCorrection(font, fontSize) : 0;
  return { cache, fontSize, emojiCorrection };
}
function clearMeasurementCaches() {
  segmentMetricCaches.clear();
  emojiCorrectionCache.clear();
  sharedGraphemeSegmenter = null;
}

// lib/pretext/line-break.js
function canBreakAfter(kind) {
  return kind === "space" || kind === "preserved-space" || kind === "tab" || kind === "zero-width-break" || kind === "soft-hyphen";
}
function isSimpleCollapsibleSpace(kind) {
  return kind === "space";
}
function getTabAdvance(lineWidth, tabStopAdvance) {
  if (tabStopAdvance <= 0)
    return 0;
  const remainder = lineWidth % tabStopAdvance;
  if (Math.abs(remainder) <= 1e-6)
    return tabStopAdvance;
  return tabStopAdvance - remainder;
}
function getBreakableAdvance(graphemeWidths, graphemePrefixWidths, graphemeIndex, preferPrefixWidths) {
  if (!preferPrefixWidths || graphemePrefixWidths === null) {
    return graphemeWidths[graphemeIndex];
  }
  return graphemePrefixWidths[graphemeIndex] - (graphemeIndex > 0 ? graphemePrefixWidths[graphemeIndex - 1] : 0);
}
function fitSoftHyphenBreak(graphemeWidths, initialWidth, maxWidth, lineFitEpsilon, discretionaryHyphenWidth, cumulativeWidths) {
  let fitCount = 0;
  let fittedWidth = initialWidth;
  while (fitCount < graphemeWidths.length) {
    const nextWidth = cumulativeWidths ? initialWidth + graphemeWidths[fitCount] : fittedWidth + graphemeWidths[fitCount];
    const nextLineWidth = fitCount + 1 < graphemeWidths.length ? nextWidth + discretionaryHyphenWidth : nextWidth;
    if (nextLineWidth > maxWidth + lineFitEpsilon)
      break;
    fittedWidth = nextWidth;
    fitCount++;
  }
  return { fitCount, fittedWidth };
}
function countPreparedLines(prepared, maxWidth) {
  if (prepared.simpleLineWalkFastPath) {
    return countPreparedLinesSimple(prepared, maxWidth);
  }
  return walkPreparedLines(prepared, maxWidth);
}
function countPreparedLinesSimple(prepared, maxWidth) {
  const { widths, kinds, breakableWidths, breakablePrefixWidths } = prepared;
  if (widths.length === 0)
    return 0;
  const engineProfile = getEngineProfile();
  const lineFitEpsilon = engineProfile.lineFitEpsilon;
  let lineCount = 0;
  let lineW = 0;
  let hasContent = false;
  function placeOnFreshLine(segmentIndex) {
    var _a;
    const w = widths[segmentIndex];
    if (w > maxWidth && breakableWidths[segmentIndex] !== null) {
      const gWidths = breakableWidths[segmentIndex];
      const gPrefixWidths = (_a = breakablePrefixWidths[segmentIndex]) != null ? _a : null;
      lineW = 0;
      for (let g = 0; g < gWidths.length; g++) {
        const gw = getBreakableAdvance(gWidths, gPrefixWidths, g, engineProfile.preferPrefixWidthsForBreakableRuns);
        if (lineW > 0 && lineW + gw > maxWidth + lineFitEpsilon) {
          lineCount++;
          lineW = gw;
        } else {
          if (lineW === 0)
            lineCount++;
          lineW += gw;
        }
      }
    } else {
      lineW = w;
      lineCount++;
    }
    hasContent = true;
  }
  for (let i = 0; i < widths.length; i++) {
    const w = widths[i];
    const kind = kinds[i];
    if (!hasContent) {
      placeOnFreshLine(i);
      continue;
    }
    const newW = lineW + w;
    if (newW > maxWidth + lineFitEpsilon) {
      if (isSimpleCollapsibleSpace(kind))
        continue;
      lineW = 0;
      hasContent = false;
      placeOnFreshLine(i);
      continue;
    }
    lineW = newW;
  }
  if (!hasContent)
    return lineCount + 1;
  return lineCount;
}
function walkPreparedLinesSimple(prepared, maxWidth, onLine) {
  const { widths, kinds, breakableWidths, breakablePrefixWidths } = prepared;
  if (widths.length === 0)
    return 0;
  const engineProfile = getEngineProfile();
  const lineFitEpsilon = engineProfile.lineFitEpsilon;
  let lineCount = 0;
  let lineW = 0;
  let hasContent = false;
  let lineStartSegmentIndex = 0;
  let lineStartGraphemeIndex = 0;
  let lineEndSegmentIndex = 0;
  let lineEndGraphemeIndex = 0;
  let pendingBreakSegmentIndex = -1;
  let pendingBreakPaintWidth = 0;
  function clearPendingBreak() {
    pendingBreakSegmentIndex = -1;
    pendingBreakPaintWidth = 0;
  }
  function emitCurrentLine(endSegmentIndex = lineEndSegmentIndex, endGraphemeIndex = lineEndGraphemeIndex, width = lineW) {
    lineCount++;
    onLine == null ? void 0 : onLine({
      startSegmentIndex: lineStartSegmentIndex,
      startGraphemeIndex: lineStartGraphemeIndex,
      endSegmentIndex,
      endGraphemeIndex,
      width
    });
    lineW = 0;
    hasContent = false;
    clearPendingBreak();
  }
  function startLineAtSegment(segmentIndex, width) {
    hasContent = true;
    lineStartSegmentIndex = segmentIndex;
    lineStartGraphemeIndex = 0;
    lineEndSegmentIndex = segmentIndex + 1;
    lineEndGraphemeIndex = 0;
    lineW = width;
  }
  function startLineAtGrapheme(segmentIndex, graphemeIndex, width) {
    hasContent = true;
    lineStartSegmentIndex = segmentIndex;
    lineStartGraphemeIndex = graphemeIndex;
    lineEndSegmentIndex = segmentIndex;
    lineEndGraphemeIndex = graphemeIndex + 1;
    lineW = width;
  }
  function appendWholeSegment(segmentIndex, width) {
    if (!hasContent) {
      startLineAtSegment(segmentIndex, width);
      return;
    }
    lineW += width;
    lineEndSegmentIndex = segmentIndex + 1;
    lineEndGraphemeIndex = 0;
  }
  function updatePendingBreak(segmentIndex, segmentWidth) {
    if (!canBreakAfter(kinds[segmentIndex]))
      return;
    pendingBreakSegmentIndex = segmentIndex + 1;
    pendingBreakPaintWidth = lineW - segmentWidth;
  }
  function appendBreakableSegment(segmentIndex) {
    appendBreakableSegmentFrom(segmentIndex, 0);
  }
  function appendBreakableSegmentFrom(segmentIndex, startGraphemeIndex) {
    var _a;
    const gWidths = breakableWidths[segmentIndex];
    const gPrefixWidths = (_a = breakablePrefixWidths[segmentIndex]) != null ? _a : null;
    for (let g = startGraphemeIndex; g < gWidths.length; g++) {
      const gw = getBreakableAdvance(gWidths, gPrefixWidths, g, engineProfile.preferPrefixWidthsForBreakableRuns);
      if (!hasContent) {
        startLineAtGrapheme(segmentIndex, g, gw);
        continue;
      }
      if (lineW + gw > maxWidth + lineFitEpsilon) {
        emitCurrentLine();
        startLineAtGrapheme(segmentIndex, g, gw);
      } else {
        lineW += gw;
        lineEndSegmentIndex = segmentIndex;
        lineEndGraphemeIndex = g + 1;
      }
    }
    if (hasContent && lineEndSegmentIndex === segmentIndex && lineEndGraphemeIndex === gWidths.length) {
      lineEndSegmentIndex = segmentIndex + 1;
      lineEndGraphemeIndex = 0;
    }
  }
  let i = 0;
  while (i < widths.length) {
    const w = widths[i];
    const kind = kinds[i];
    if (!hasContent) {
      if (w > maxWidth && breakableWidths[i] !== null) {
        appendBreakableSegment(i);
      } else {
        startLineAtSegment(i, w);
      }
      updatePendingBreak(i, w);
      i++;
      continue;
    }
    const newW = lineW + w;
    if (newW > maxWidth + lineFitEpsilon) {
      if (canBreakAfter(kind)) {
        appendWholeSegment(i, w);
        emitCurrentLine(i + 1, 0, lineW - w);
        i++;
        continue;
      }
      if (pendingBreakSegmentIndex >= 0) {
        emitCurrentLine(pendingBreakSegmentIndex, 0, pendingBreakPaintWidth);
        continue;
      }
      if (w > maxWidth && breakableWidths[i] !== null) {
        emitCurrentLine();
        appendBreakableSegment(i);
        i++;
        continue;
      }
      emitCurrentLine();
      continue;
    }
    appendWholeSegment(i, w);
    updatePendingBreak(i, w);
    i++;
  }
  if (hasContent)
    emitCurrentLine();
  return lineCount;
}
function walkPreparedLines(prepared, maxWidth, onLine) {
  if (prepared.simpleLineWalkFastPath) {
    return walkPreparedLinesSimple(prepared, maxWidth, onLine);
  }
  const { widths, lineEndFitAdvances, lineEndPaintAdvances, kinds, breakableWidths, breakablePrefixWidths, discretionaryHyphenWidth, tabStopAdvance, chunks } = prepared;
  if (widths.length === 0 || chunks.length === 0)
    return 0;
  const engineProfile = getEngineProfile();
  const lineFitEpsilon = engineProfile.lineFitEpsilon;
  let lineCount = 0;
  let lineW = 0;
  let hasContent = false;
  let lineStartSegmentIndex = 0;
  let lineStartGraphemeIndex = 0;
  let lineEndSegmentIndex = 0;
  let lineEndGraphemeIndex = 0;
  let pendingBreakSegmentIndex = -1;
  let pendingBreakFitWidth = 0;
  let pendingBreakPaintWidth = 0;
  let pendingBreakKind = null;
  function clearPendingBreak() {
    pendingBreakSegmentIndex = -1;
    pendingBreakFitWidth = 0;
    pendingBreakPaintWidth = 0;
    pendingBreakKind = null;
  }
  function emitCurrentLine(endSegmentIndex = lineEndSegmentIndex, endGraphemeIndex = lineEndGraphemeIndex, width = lineW) {
    lineCount++;
    onLine == null ? void 0 : onLine({
      startSegmentIndex: lineStartSegmentIndex,
      startGraphemeIndex: lineStartGraphemeIndex,
      endSegmentIndex,
      endGraphemeIndex,
      width
    });
    lineW = 0;
    hasContent = false;
    clearPendingBreak();
  }
  function startLineAtSegment(segmentIndex, width) {
    hasContent = true;
    lineStartSegmentIndex = segmentIndex;
    lineStartGraphemeIndex = 0;
    lineEndSegmentIndex = segmentIndex + 1;
    lineEndGraphemeIndex = 0;
    lineW = width;
  }
  function startLineAtGrapheme(segmentIndex, graphemeIndex, width) {
    hasContent = true;
    lineStartSegmentIndex = segmentIndex;
    lineStartGraphemeIndex = graphemeIndex;
    lineEndSegmentIndex = segmentIndex;
    lineEndGraphemeIndex = graphemeIndex + 1;
    lineW = width;
  }
  function appendWholeSegment(segmentIndex, width) {
    if (!hasContent) {
      startLineAtSegment(segmentIndex, width);
      return;
    }
    lineW += width;
    lineEndSegmentIndex = segmentIndex + 1;
    lineEndGraphemeIndex = 0;
  }
  function updatePendingBreakForWholeSegment(segmentIndex, segmentWidth) {
    if (!canBreakAfter(kinds[segmentIndex]))
      return;
    const fitAdvance = kinds[segmentIndex] === "tab" ? 0 : lineEndFitAdvances[segmentIndex];
    const paintAdvance = kinds[segmentIndex] === "tab" ? segmentWidth : lineEndPaintAdvances[segmentIndex];
    pendingBreakSegmentIndex = segmentIndex + 1;
    pendingBreakFitWidth = lineW - segmentWidth + fitAdvance;
    pendingBreakPaintWidth = lineW - segmentWidth + paintAdvance;
    pendingBreakKind = kinds[segmentIndex];
  }
  function appendBreakableSegment(segmentIndex) {
    appendBreakableSegmentFrom(segmentIndex, 0);
  }
  function appendBreakableSegmentFrom(segmentIndex, startGraphemeIndex) {
    var _a;
    const gWidths = breakableWidths[segmentIndex];
    const gPrefixWidths = (_a = breakablePrefixWidths[segmentIndex]) != null ? _a : null;
    for (let g = startGraphemeIndex; g < gWidths.length; g++) {
      const gw = getBreakableAdvance(gWidths, gPrefixWidths, g, engineProfile.preferPrefixWidthsForBreakableRuns);
      if (!hasContent) {
        startLineAtGrapheme(segmentIndex, g, gw);
        continue;
      }
      if (lineW + gw > maxWidth + lineFitEpsilon) {
        emitCurrentLine();
        startLineAtGrapheme(segmentIndex, g, gw);
      } else {
        lineW += gw;
        lineEndSegmentIndex = segmentIndex;
        lineEndGraphemeIndex = g + 1;
      }
    }
    if (hasContent && lineEndSegmentIndex === segmentIndex && lineEndGraphemeIndex === gWidths.length) {
      lineEndSegmentIndex = segmentIndex + 1;
      lineEndGraphemeIndex = 0;
    }
  }
  function continueSoftHyphenBreakableSegment(segmentIndex) {
    var _a;
    if (pendingBreakKind !== "soft-hyphen")
      return false;
    const gWidths = breakableWidths[segmentIndex];
    if (gWidths === null)
      return false;
    const fitWidths = engineProfile.preferPrefixWidthsForBreakableRuns ? (_a = breakablePrefixWidths[segmentIndex]) != null ? _a : gWidths : gWidths;
    const usesPrefixWidths = fitWidths !== gWidths;
    const { fitCount, fittedWidth } = fitSoftHyphenBreak(fitWidths, lineW, maxWidth, lineFitEpsilon, discretionaryHyphenWidth, usesPrefixWidths);
    if (fitCount === 0)
      return false;
    lineW = fittedWidth;
    lineEndSegmentIndex = segmentIndex;
    lineEndGraphemeIndex = fitCount;
    clearPendingBreak();
    if (fitCount === gWidths.length) {
      lineEndSegmentIndex = segmentIndex + 1;
      lineEndGraphemeIndex = 0;
      return true;
    }
    emitCurrentLine(segmentIndex, fitCount, fittedWidth + discretionaryHyphenWidth);
    appendBreakableSegmentFrom(segmentIndex, fitCount);
    return true;
  }
  function emitEmptyChunk(chunk) {
    lineCount++;
    onLine == null ? void 0 : onLine({
      startSegmentIndex: chunk.startSegmentIndex,
      startGraphemeIndex: 0,
      endSegmentIndex: chunk.consumedEndSegmentIndex,
      endGraphemeIndex: 0,
      width: 0
    });
    clearPendingBreak();
  }
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];
    if (chunk.startSegmentIndex === chunk.endSegmentIndex) {
      emitEmptyChunk(chunk);
      continue;
    }
    hasContent = false;
    lineW = 0;
    lineStartSegmentIndex = chunk.startSegmentIndex;
    lineStartGraphemeIndex = 0;
    lineEndSegmentIndex = chunk.startSegmentIndex;
    lineEndGraphemeIndex = 0;
    clearPendingBreak();
    let i = chunk.startSegmentIndex;
    while (i < chunk.endSegmentIndex) {
      const kind = kinds[i];
      const w = kind === "tab" ? getTabAdvance(lineW, tabStopAdvance) : widths[i];
      if (kind === "soft-hyphen") {
        if (hasContent) {
          lineEndSegmentIndex = i + 1;
          lineEndGraphemeIndex = 0;
          pendingBreakSegmentIndex = i + 1;
          pendingBreakFitWidth = lineW + discretionaryHyphenWidth;
          pendingBreakPaintWidth = lineW + discretionaryHyphenWidth;
          pendingBreakKind = kind;
        }
        i++;
        continue;
      }
      if (!hasContent) {
        if (w > maxWidth && breakableWidths[i] !== null) {
          appendBreakableSegment(i);
        } else {
          startLineAtSegment(i, w);
        }
        updatePendingBreakForWholeSegment(i, w);
        i++;
        continue;
      }
      const newW = lineW + w;
      if (newW > maxWidth + lineFitEpsilon) {
        const currentBreakFitWidth = lineW + (kind === "tab" ? 0 : lineEndFitAdvances[i]);
        const currentBreakPaintWidth = lineW + (kind === "tab" ? w : lineEndPaintAdvances[i]);
        if (pendingBreakKind === "soft-hyphen" && engineProfile.preferEarlySoftHyphenBreak && pendingBreakFitWidth <= maxWidth + lineFitEpsilon) {
          emitCurrentLine(pendingBreakSegmentIndex, 0, pendingBreakPaintWidth);
          continue;
        }
        if (pendingBreakKind === "soft-hyphen" && continueSoftHyphenBreakableSegment(i)) {
          i++;
          continue;
        }
        if (canBreakAfter(kind) && currentBreakFitWidth <= maxWidth + lineFitEpsilon) {
          appendWholeSegment(i, w);
          emitCurrentLine(i + 1, 0, currentBreakPaintWidth);
          i++;
          continue;
        }
        if (pendingBreakSegmentIndex >= 0 && pendingBreakFitWidth <= maxWidth + lineFitEpsilon) {
          emitCurrentLine(pendingBreakSegmentIndex, 0, pendingBreakPaintWidth);
          continue;
        }
        if (w > maxWidth && breakableWidths[i] !== null) {
          emitCurrentLine();
          appendBreakableSegment(i);
          i++;
          continue;
        }
        emitCurrentLine();
        continue;
      }
      appendWholeSegment(i, w);
      updatePendingBreakForWholeSegment(i, w);
      i++;
    }
    if (hasContent) {
      const finalPaintWidth = pendingBreakSegmentIndex === chunk.consumedEndSegmentIndex ? pendingBreakPaintWidth : lineW;
      emitCurrentLine(chunk.consumedEndSegmentIndex, 0, finalPaintWidth);
    }
  }
  return lineCount;
}

// lib/pretext/layout.js
var sharedGraphemeSegmenter2 = null;
var sharedLineTextCaches = /* @__PURE__ */ new WeakMap();
function getSharedGraphemeSegmenter2() {
  if (sharedGraphemeSegmenter2 === null) {
    sharedGraphemeSegmenter2 = new Intl.Segmenter(void 0, { granularity: "grapheme" });
  }
  return sharedGraphemeSegmenter2;
}
function createEmptyPrepared(includeSegments) {
  if (includeSegments) {
    return {
      widths: [],
      lineEndFitAdvances: [],
      lineEndPaintAdvances: [],
      kinds: [],
      simpleLineWalkFastPath: true,
      segLevels: null,
      breakableWidths: [],
      breakablePrefixWidths: [],
      discretionaryHyphenWidth: 0,
      tabStopAdvance: 0,
      chunks: [],
      segments: []
    };
  }
  return {
    widths: [],
    lineEndFitAdvances: [],
    lineEndPaintAdvances: [],
    kinds: [],
    simpleLineWalkFastPath: true,
    segLevels: null,
    breakableWidths: [],
    breakablePrefixWidths: [],
    discretionaryHyphenWidth: 0,
    tabStopAdvance: 0,
    chunks: []
  };
}
function measureAnalysis(analysis, font, includeSegments) {
  const graphemeSegmenter = getSharedGraphemeSegmenter2();
  const engineProfile = getEngineProfile();
  const { cache, emojiCorrection } = getFontMeasurementState(font, textMayContainEmoji(analysis.normalized));
  const discretionaryHyphenWidth = getCorrectedSegmentWidth("-", getSegmentMetrics("-", cache), emojiCorrection);
  const spaceWidth = getCorrectedSegmentWidth(" ", getSegmentMetrics(" ", cache), emojiCorrection);
  const tabStopAdvance = spaceWidth * 8;
  if (analysis.len === 0)
    return createEmptyPrepared(includeSegments);
  const widths = [];
  const lineEndFitAdvances = [];
  const lineEndPaintAdvances = [];
  const kinds = [];
  let simpleLineWalkFastPath = analysis.chunks.length <= 1;
  const segStarts = includeSegments ? [] : null;
  const breakableWidths = [];
  const breakablePrefixWidths = [];
  const segments = includeSegments ? [] : null;
  const preparedStartByAnalysisIndex = Array.from({ length: analysis.len });
  const preparedEndByAnalysisIndex = Array.from({ length: analysis.len });
  function pushMeasuredSegment(text, width, lineEndFitAdvance, lineEndPaintAdvance, kind, start, breakable, breakablePrefix) {
    if (kind !== "text" && kind !== "space" && kind !== "zero-width-break") {
      simpleLineWalkFastPath = false;
    }
    widths.push(width);
    lineEndFitAdvances.push(lineEndFitAdvance);
    lineEndPaintAdvances.push(lineEndPaintAdvance);
    kinds.push(kind);
    segStarts == null ? void 0 : segStarts.push(start);
    breakableWidths.push(breakable);
    breakablePrefixWidths.push(breakablePrefix);
    if (segments !== null)
      segments.push(text);
  }
  for (let mi = 0; mi < analysis.len; mi++) {
    preparedStartByAnalysisIndex[mi] = widths.length;
    const segText = analysis.texts[mi];
    const segWordLike = analysis.isWordLike[mi];
    const segKind = analysis.kinds[mi];
    const segStart = analysis.starts[mi];
    if (segKind === "soft-hyphen") {
      pushMeasuredSegment(segText, 0, discretionaryHyphenWidth, discretionaryHyphenWidth, segKind, segStart, null, null);
      preparedEndByAnalysisIndex[mi] = widths.length;
      continue;
    }
    if (segKind === "hard-break") {
      pushMeasuredSegment(segText, 0, 0, 0, segKind, segStart, null, null);
      preparedEndByAnalysisIndex[mi] = widths.length;
      continue;
    }
    if (segKind === "tab") {
      pushMeasuredSegment(segText, 0, 0, 0, segKind, segStart, null, null);
      preparedEndByAnalysisIndex[mi] = widths.length;
      continue;
    }
    const segMetrics = getSegmentMetrics(segText, cache);
    if (segKind === "text" && segMetrics.containsCJK) {
      let unitText = "";
      let unitStart = 0;
      for (const gs of graphemeSegmenter.segment(segText)) {
        const grapheme = gs.segment;
        if (unitText.length === 0) {
          unitText = grapheme;
          unitStart = gs.index;
          continue;
        }
        if (kinsokuEnd.has(unitText) || kinsokuStart.has(grapheme) || leftStickyPunctuation.has(grapheme) || engineProfile.carryCJKAfterClosingQuote && isCJK(grapheme) && endsWithClosingQuote(unitText)) {
          unitText += grapheme;
          continue;
        }
        const unitMetrics = getSegmentMetrics(unitText, cache);
        const w2 = getCorrectedSegmentWidth(unitText, unitMetrics, emojiCorrection);
        pushMeasuredSegment(unitText, w2, w2, w2, "text", segStart + unitStart, null, null);
        unitText = grapheme;
        unitStart = gs.index;
      }
      if (unitText.length > 0) {
        const unitMetrics = getSegmentMetrics(unitText, cache);
        const w2 = getCorrectedSegmentWidth(unitText, unitMetrics, emojiCorrection);
        pushMeasuredSegment(unitText, w2, w2, w2, "text", segStart + unitStart, null, null);
      }
      preparedEndByAnalysisIndex[mi] = widths.length;
      continue;
    }
    const w = getCorrectedSegmentWidth(segText, segMetrics, emojiCorrection);
    const lineEndFitAdvance = segKind === "space" || segKind === "preserved-space" || segKind === "zero-width-break" ? 0 : w;
    const lineEndPaintAdvance = segKind === "space" || segKind === "zero-width-break" ? 0 : w;
    if (segWordLike && segText.length > 1) {
      const graphemeWidths = getSegmentGraphemeWidths(segText, segMetrics, cache, emojiCorrection);
      const graphemePrefixWidths = engineProfile.preferPrefixWidthsForBreakableRuns ? getSegmentGraphemePrefixWidths(segText, segMetrics, cache, emojiCorrection) : null;
      pushMeasuredSegment(segText, w, lineEndFitAdvance, lineEndPaintAdvance, segKind, segStart, graphemeWidths, graphemePrefixWidths);
    } else {
      pushMeasuredSegment(segText, w, lineEndFitAdvance, lineEndPaintAdvance, segKind, segStart, null, null);
    }
    preparedEndByAnalysisIndex[mi] = widths.length;
  }
  const chunks = mapAnalysisChunksToPreparedChunks(analysis.chunks, preparedStartByAnalysisIndex, preparedEndByAnalysisIndex);
  const segLevels = segStarts === null ? null : computeSegmentLevels(analysis.normalized, segStarts);
  if (segments !== null) {
    return {
      widths,
      lineEndFitAdvances,
      lineEndPaintAdvances,
      kinds,
      simpleLineWalkFastPath,
      segLevels,
      breakableWidths,
      breakablePrefixWidths,
      discretionaryHyphenWidth,
      tabStopAdvance,
      chunks,
      segments
    };
  }
  return {
    widths,
    lineEndFitAdvances,
    lineEndPaintAdvances,
    kinds,
    simpleLineWalkFastPath,
    segLevels,
    breakableWidths,
    breakablePrefixWidths,
    discretionaryHyphenWidth,
    tabStopAdvance,
    chunks
  };
}
function mapAnalysisChunksToPreparedChunks(chunks, preparedStartByAnalysisIndex, preparedEndByAnalysisIndex) {
  var _a, _b, _c;
  const preparedChunks = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const startSegmentIndex = chunk.startSegmentIndex < preparedStartByAnalysisIndex.length ? preparedStartByAnalysisIndex[chunk.startSegmentIndex] : (_a = preparedEndByAnalysisIndex[preparedEndByAnalysisIndex.length - 1]) != null ? _a : 0;
    const endSegmentIndex = chunk.endSegmentIndex < preparedStartByAnalysisIndex.length ? preparedStartByAnalysisIndex[chunk.endSegmentIndex] : (_b = preparedEndByAnalysisIndex[preparedEndByAnalysisIndex.length - 1]) != null ? _b : 0;
    const consumedEndSegmentIndex = chunk.consumedEndSegmentIndex < preparedStartByAnalysisIndex.length ? preparedStartByAnalysisIndex[chunk.consumedEndSegmentIndex] : (_c = preparedEndByAnalysisIndex[preparedEndByAnalysisIndex.length - 1]) != null ? _c : 0;
    preparedChunks.push({
      startSegmentIndex,
      endSegmentIndex,
      consumedEndSegmentIndex
    });
  }
  return preparedChunks;
}
function prepareInternal(text, font, includeSegments, options) {
  const analysis = analyzeText(text, getEngineProfile(), options == null ? void 0 : options.whiteSpace);
  return measureAnalysis(analysis, font, includeSegments);
}
function prepare(text, font, options) {
  return prepareInternal(text, font, false, options);
}
function getInternalPrepared(prepared) {
  return prepared;
}
function layout(prepared, maxWidth, lineHeight) {
  const lineCount = countPreparedLines(getInternalPrepared(prepared), maxWidth);
  return { lineCount, height: lineCount * lineHeight };
}
function getSegmentGraphemes(segmentIndex, segments, cache) {
  let graphemes = cache.get(segmentIndex);
  if (graphemes !== void 0)
    return graphemes;
  graphemes = [];
  const graphemeSegmenter = getSharedGraphemeSegmenter2();
  for (const gs of graphemeSegmenter.segment(segments[segmentIndex])) {
    graphemes.push(gs.segment);
  }
  cache.set(segmentIndex, graphemes);
  return graphemes;
}
function getLineTextCache(prepared) {
  let cache = sharedLineTextCaches.get(prepared);
  if (cache !== void 0)
    return cache;
  cache = /* @__PURE__ */ new Map();
  sharedLineTextCaches.set(prepared, cache);
  return cache;
}
function lineHasDiscretionaryHyphen(kinds, startSegmentIndex, startGraphemeIndex, endSegmentIndex) {
  return endSegmentIndex > 0 && kinds[endSegmentIndex - 1] === "soft-hyphen" && !(startSegmentIndex === endSegmentIndex && startGraphemeIndex > 0);
}
function buildLineTextFromRange(segments, kinds, cache, startSegmentIndex, startGraphemeIndex, endSegmentIndex, endGraphemeIndex) {
  let text = "";
  const endsWithDiscretionaryHyphen = lineHasDiscretionaryHyphen(kinds, startSegmentIndex, startGraphemeIndex, endSegmentIndex);
  for (let i = startSegmentIndex; i < endSegmentIndex; i++) {
    if (kinds[i] === "soft-hyphen" || kinds[i] === "hard-break")
      continue;
    if (i === startSegmentIndex && startGraphemeIndex > 0) {
      text += getSegmentGraphemes(i, segments, cache).slice(startGraphemeIndex).join("");
    } else {
      text += segments[i];
    }
  }
  if (endGraphemeIndex > 0) {
    if (endsWithDiscretionaryHyphen)
      text += "-";
    text += getSegmentGraphemes(endSegmentIndex, segments, cache).slice(startSegmentIndex === endSegmentIndex ? startGraphemeIndex : 0, endGraphemeIndex).join("");
  } else if (endsWithDiscretionaryHyphen) {
    text += "-";
  }
  return text;
}
function createLayoutLine(prepared, cache, width, startSegmentIndex, startGraphemeIndex, endSegmentIndex, endGraphemeIndex) {
  return {
    text: buildLineTextFromRange(prepared.segments, prepared.kinds, cache, startSegmentIndex, startGraphemeIndex, endSegmentIndex, endGraphemeIndex),
    width,
    start: {
      segmentIndex: startSegmentIndex,
      graphemeIndex: startGraphemeIndex
    },
    end: {
      segmentIndex: endSegmentIndex,
      graphemeIndex: endGraphemeIndex
    }
  };
}
function materializeLayoutLine(prepared, cache, line) {
  return createLayoutLine(prepared, cache, line.width, line.startSegmentIndex, line.startGraphemeIndex, line.endSegmentIndex, line.endGraphemeIndex);
}
function toLayoutLineRange(line) {
  return {
    width: line.width,
    start: {
      segmentIndex: line.startSegmentIndex,
      graphemeIndex: line.startGraphemeIndex
    },
    end: {
      segmentIndex: line.endSegmentIndex,
      graphemeIndex: line.endGraphemeIndex
    }
  };
}
function walkLineRanges(prepared, maxWidth, onLine) {
  if (prepared.widths.length === 0)
    return 0;
  return walkPreparedLines(getInternalPrepared(prepared), maxWidth, (line) => {
    onLine(toLayoutLineRange(line));
  });
}
function layoutWithLines(prepared, maxWidth, lineHeight) {
  const lines = [];
  if (prepared.widths.length === 0)
    return { lineCount: 0, height: 0, lines };
  const graphemeCache = getLineTextCache(prepared);
  const lineCount = walkPreparedLines(getInternalPrepared(prepared), maxWidth, (line) => {
    lines.push(materializeLayoutLine(prepared, graphemeCache, line));
  });
  return { lineCount, height: lineCount * lineHeight, lines };
}
function clearCache() {
  clearAnalysisCaches();
  sharedGraphemeSegmenter2 = null;
  sharedLineTextCaches = /* @__PURE__ */ new WeakMap();
  clearMeasurementCaches();
}

// src/PretextManager.ts
var PretextManager = class {
  constructor(cache) {
    this.loaded = false;
    this.loadFailed = false;
    this.cache = cache;
  }
  async initialize() {
    this.loaded = true;
    logger.info("Pretext library loaded successfully.");
    return true;
  }
  prepare(text, font) {
    if (!this.loaded) return null;
    try {
      return prepare(text, font.fontFamily, {
        whiteSpace: "normal"
      });
    } catch (err) {
      logger.warn("prepare() failed:", err);
      return null;
    }
  }
  layout(prepared, maxWidth, lineHeight) {
    if (!this.loaded || !prepared) return null;
    try {
      return layout(prepared, maxWidth, lineHeight);
    } catch (err) {
      logger.warn("layout() failed:", err);
      return null;
    }
  }
  layoutWithLines(prepared, maxWidth, lineHeight) {
    if (!this.loaded || !prepared) return null;
    try {
      return layoutWithLines(prepared, maxWidth, lineHeight);
    } catch (err) {
      logger.warn("layoutWithLines() failed:", err);
      return null;
    }
  }
  walkLineRanges(prepared, maxWidth, onLine) {
    if (!this.loaded || !prepared) return;
    try {
      walkLineRanges(prepared, maxWidth, onLine);
    } catch (err) {
      logger.warn("walkLineRanges() failed:", err);
    }
  }
  clearCache() {
    this.cache.clear();
    if (this.loaded) {
      clearCache();
    }
  }
  isReady() {
    return this.loaded;
  }
  hasFailed() {
    return this.loadFailed;
  }
};

// src/MeasurementCache.ts
var MeasurementCache = class {
  constructor(maxSize = 1e3) {
    this.hits = 0;
    this.misses = 0;
    this.cache = /* @__PURE__ */ new Map();
    this.maxSize = maxSize;
  }
  getStats() {
    return {
      hits: this.hits,
      misses: this.misses,
      total: this.hits + this.misses,
      size: this.cache.size
    };
  }
  setMaxSize(size) {
    this.maxSize = size;
    while (this.cache.size > this.maxSize) {
      this.evictOldest();
    }
  }
  makeKey(text, fontFamily, fontSize, fontWeight, maxWidth, lineHeight) {
    return `${text}:${fontFamily}:${fontSize}:${fontWeight}:${maxWidth}:${lineHeight}`;
  }
  getCacheKey(text, fontFamily, fontSize, fontWeight, maxWidth, lineHeight) {
    return this.makeKey(text, fontFamily, fontSize, fontWeight, maxWidth, lineHeight);
  }
  get(textOrKey, fontFamily, fontSize, fontWeight, maxWidth, lineHeight) {
    const key = fontFamily !== void 0 && fontSize !== void 0 && fontWeight !== void 0 && maxWidth !== void 0 && lineHeight !== void 0 ? this.makeKey(textOrKey, fontFamily, fontSize, fontWeight, maxWidth, lineHeight) : textOrKey;
    const entry = this.cache.get(key);
    if (entry) {
      this.hits++;
      this.cache.delete(key);
      this.cache.set(key, entry);
      return entry.value;
    }
    this.misses++;
    return null;
  }
  set(textOrKey, fontFamilyOrValue, fontSize, fontWeight, maxWidth, lineHeight, value) {
    let key;
    let val;
    if (typeof fontFamilyOrValue === "string" && fontSize !== void 0 && fontWeight !== void 0 && maxWidth !== void 0 && lineHeight !== void 0 && value !== void 0) {
      key = this.makeKey(textOrKey, fontFamilyOrValue, fontSize, fontWeight, maxWidth, lineHeight);
      val = value;
    } else {
      key = textOrKey;
      val = fontFamilyOrValue;
    }
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    this.cache.set(key, { value: val });
  }
  evictOldest() {
    if (this.cache.size === 0) {
      return;
    }
    const oldestKey = this.cache.keys().next().value;
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
  get size() {
    return this.cache.size;
  }
};

// src/utils/FontMetrics.ts
var fontInfoCache = /* @__PURE__ */ new WeakMap();
var containerWidthCache = /* @__PURE__ */ new WeakMap();
var cacheInvalidated = false;
var resetRafId = null;
function invalidateCaches() {
  cacheInvalidated = true;
  if (resetRafId !== null) return;
  const schedule = typeof window !== "undefined" && typeof window.requestAnimationFrame === "function" ? window.requestAnimationFrame.bind(window) : (cb) => window.setTimeout(() => cb(performance.now()), 16);
  resetRafId = schedule(() => {
    resetRafId = null;
    cacheInvalidated = false;
  });
}
if (typeof window !== "undefined") {
  window.addEventListener("resize", invalidateCaches);
}
function getFontInfoFromElement(el) {
  if (!cacheInvalidated && fontInfoCache.has(el)) {
    return fontInfoCache.get(el);
  }
  const style = window.getComputedStyle(el);
  let fontFamily = style.fontFamily || "sans-serif";
  fontFamily = fontFamily.replace(/['"]/g, "").split(",")[0].trim();
  const fontSize = parseFloat(style.fontSize) || 16;
  const fontWeight = parseInt(style.fontWeight, 10) || 400;
  let lineHeight = parseFloat(style.lineHeight);
  if (isNaN(lineHeight) || lineHeight === 0) {
    lineHeight = 1.5;
  } else if (!style.lineHeight.includes("px")) {
    lineHeight = lineHeight * fontSize;
  }
  const info = {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight
  };
  fontInfoCache.set(el, info);
  return info;
}
function getContainerWidth(el) {
  if (!cacheInvalidated && containerWidthCache.has(el)) {
    return containerWidthCache.get(el);
  }
  const width = el.clientWidth || 700;
  containerWidthCache.set(el, width);
  return width;
}
function invalidateFontCache() {
  invalidateCaches();
}

// src/hooks/HeavyElementOptimizer.ts
var HEAVY_SELECTORS = [
  ".callout",
  // Covers .markdown-preview-view .callout and .markdown-source-view .callout
  ".callout-content",
  // Inner content of callouts
  "blockquote",
  // Large block quotes
  "table td"
  // Tables with potential wrapping
];
function processHeavyElement(el, pretextManager, cache, forceWidth, onProcessed) {
  if (!forceWidth && el.hasAttribute("data-pretext-optimized")) {
    return;
  }
  const text = el.textContent || "";
  if (!text.trim() || text.length < 50) {
    return;
  }
  const font = getFontInfoFromElement(el);
  const maxWidth = forceWidth || getContainerWidth(el);
  const lineHeightPx = font.lineHeight;
  const cacheKey = cache.getCacheKey(
    text,
    font.fontFamily,
    font.fontSize,
    font.fontWeight,
    maxWidth,
    lineHeightPx
  );
  const cached = cache.get(cacheKey);
  if (cached) {
    el.style.minHeight = `${cached.height}px`;
    el.setAttribute("data-pretext-optimized", "cached");
    el.setAttribute("data-pretext-width", String(maxWidth));
    if (onProcessed) onProcessed(0, true);
    return;
  }
  const startMark = typeof performance !== "undefined" ? performance.now() : Date.now();
  const prepared = pretextManager.prepare(text, font);
  if (!prepared) {
    return;
  }
  const layout2 = pretextManager.layout(prepared, maxWidth, lineHeightPx);
  if (!layout2) {
    return;
  }
  cache.set(cacheKey, layout2);
  el.style.minHeight = `${layout2.height}px`;
  el.setAttribute("data-pretext-optimized", "true");
  el.setAttribute("data-pretext-lines", String(layout2.lineCount));
  el.setAttribute("data-pretext-width", String(maxWidth));
  if (onProcessed) {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    onProcessed(now - startMark, false);
  }
}

// src/hooks/MarkdownPostProcessor.ts
function createMarkdownPostProcessor(pretextManager, cache, onProcessed) {
  return (element, context) => {
    if (!pretextManager.isReady()) {
      return;
    }
    const allHeavyEls = [];
    const combinedSelector = HEAVY_SELECTORS.join(", ");
    const heavyEls = element.querySelectorAll(combinedSelector);
    heavyEls.forEach((el) => allHeavyEls.push(el));
    let index = 0;
    function processBatch(deadline) {
      while (index < allHeavyEls.length && deadline.timeRemaining() > 2) {
        const el = allHeavyEls[index++];
        processHeavyElement(el, pretextManager, cache, void 0, onProcessed);
      }
      if (index < allHeavyEls.length) {
        if (typeof window !== "undefined" && window.requestIdleCallback) {
          window.requestIdleCallback(processBatch);
        } else {
          setTimeout(() => processBatch({ timeRemaining: () => 10 }), 0);
        }
      }
    }
    if (allHeavyEls.length > 0) {
      if (typeof window !== "undefined" && window.requestIdleCallback) {
        window.requestIdleCallback(processBatch);
      } else {
        allHeavyEls.forEach((el) => processHeavyElement(el, pretextManager, cache, void 0, onProcessed));
      }
    }
  };
}

// src/hooks/CodeMirrorExtension.ts
var EditorViewClass = null;
var DecorationClass = null;
var RangeSetBuilderClass = null;
var MeasureCompleteAnnotation = null;
function getCodeMirrorModules() {
  var _a, _b, _c, _d, _e;
  if (EditorViewClass && DecorationClass && RangeSetBuilderClass) {
    return true;
  }
  const win = window;
  const cm = win.CodeMirror;
  if (((_a = cm == null ? void 0 : cm.view) == null ? void 0 : _a.EditorView) && ((_b = cm == null ? void 0 : cm.view) == null ? void 0 : _b.Decoration) && ((_c = cm == null ? void 0 : cm.state) == null ? void 0 : _c.RangeSetBuilder)) {
    EditorViewClass = cm.view.EditorView;
    DecorationClass = cm.view.Decoration;
    RangeSetBuilderClass = cm.state.RangeSetBuilder;
    MeasureCompleteAnnotation = ((_e = (_d = cm.state.Annotation) == null ? void 0 : _d.define) == null ? void 0 : _e.call(_d)) || null;
    return true;
  }
  return false;
}
function createPretextCodeMirrorExtension(pretextManager, cache) {
  var _a, _b;
  if (!getCodeMirrorModules() || !EditorViewClass || !DecorationClass || !RangeSetBuilderClass) {
    logger.error("CodeMirror not available");
    return ((_a = EditorViewClass == null ? void 0 : EditorViewClass.plugin) == null ? void 0 : _a.define) ? EditorViewClass.plugin.define(
      class {
        constructor() {
          this.decorations = (_b = DecorationClass == null ? void 0 : DecorationClass.none) != null ? _b : { map: () => this.decorations };
        }
      },
      { decorations: (v) => v.decorations }
    ) : {};
  }
  return EditorViewClass.plugin.define(
    class {
      constructor(view) {
        this.pendingQueue = /* @__PURE__ */ new Set();
        this.idleCallbackId = null;
        this.fontInfo = null;
        this.contentWidth = 0;
        this.view = view;
        this.updateMetrics();
        this.decorations = this.buildDecorations(view);
      }
      update(view) {
        var _a2, _b2;
        if (!pretextManager.isReady()) return;
        let needsRebuild = false;
        if (view.geometryChanged) {
          this.updateMetrics();
          needsRebuild = true;
        }
        if (view.docChanged || view.viewportChanged || ((_b2 = (_a2 = view.transactions) == null ? void 0 : _a2.some) == null ? void 0 : _b2.call(_a2, (tr) => tr.annotation(MeasureCompleteAnnotation)))) {
          needsRebuild = true;
        }
        if (needsRebuild) {
          this.decorations = this.buildDecorations(view);
        }
      }
      updateMetrics() {
        if (this.view.contentDOM) {
          this.fontInfo = getFontInfoFromElement(this.view.contentDOM);
          const scrollWidth = this.view.scrollDOM.clientWidth;
          this.contentWidth = scrollWidth ? scrollWidth - 10 : 700;
        }
      }
      buildDecorations(view) {
        const builder = new RangeSetBuilderClass();
        const { from, to } = view.viewport;
        if (to <= from || !this.fontInfo) return DecorationClass.none;
        const lineHeightPx = this.fontInfo.lineHeight;
        let hasNewPending = false;
        for (let pos = from; pos <= to; ) {
          const line = view.state.doc.lineAt(pos);
          const text = line.text;
          if (text.trim() && text.length > 50) {
            const cacheKey = cache.getCacheKey(
              text,
              this.fontInfo.fontFamily,
              this.fontInfo.fontSize,
              this.fontInfo.fontWeight,
              this.contentWidth,
              lineHeightPx
            );
            const cached = cache.get(cacheKey);
            if (cached) {
              const lineDeco = DecorationClass.line({
                attributes: {
                  style: `min-height: ${cached.height}px;`,
                  "data-pretext-cm": "true"
                }
              });
              builder.add(line.from, line.from, lineDeco);
            } else {
              if (!this.pendingQueue.has(text)) {
                this.pendingQueue.add(text);
                hasNewPending = true;
              }
            }
          }
          pos = line.to + 1;
        }
        if (hasNewPending) {
          this.scheduleMeasurement();
        }
        return builder.finish();
      }
      scheduleMeasurement() {
        if (this.idleCallbackId !== null) return;
        const schedule = typeof window !== "undefined" && window.requestIdleCallback ? window.requestIdleCallback : ((cb) => setTimeout(() => cb({ timeRemaining: () => 10 }), 50));
        this.idleCallbackId = schedule((deadline) => {
          this.idleCallbackId = null;
          this.processQueue(deadline);
        });
      }
      processQueue(deadline) {
        if (this.pendingQueue.size === 0 || !pretextManager.isReady()) return;
        const lineHeightPx = this.fontInfo.lineHeight;
        let processedCount = 0;
        for (const text of this.pendingQueue) {
          if (deadline.timeRemaining() <= 2) break;
          this.pendingQueue.delete(text);
          const prepared = pretextManager.prepare(text, this.fontInfo);
          if (prepared) {
            const layoutResult = pretextManager.layout(prepared, this.contentWidth, lineHeightPx);
            if (layoutResult) {
              const cacheKey = cache.getCacheKey(
                text,
                this.fontInfo.fontFamily,
                this.fontInfo.fontSize,
                this.fontInfo.fontWeight,
                this.contentWidth,
                lineHeightPx
              );
              cache.set(cacheKey, layoutResult);
              processedCount++;
            }
          }
        }
        if (processedCount > 0 && !this.view.isDestroyed) {
          this.view.dispatch({
            annotations: MeasureCompleteAnnotation == null ? void 0 : MeasureCompleteAnnotation.of(true)
          });
        }
        if (this.pendingQueue.size > 0) {
          this.scheduleMeasurement();
        }
      }
      destroy() {
        if (this.idleCallbackId !== null) {
          const cancel = typeof window !== "undefined" && window.cancelIdleCallback ? window.cancelIdleCallback : clearTimeout;
          cancel(this.idleCallbackId);
        }
        this.pendingQueue.clear();
      }
    },
    {
      decorations: (v) => v.decorations
    }
  );
}

// src/hooks/SettingsTab.ts
var import_obsidian = require("obsidian");
function createSettingsTab(app, plugin) {
  return new class extends import_obsidian.PluginSettingTab {
    constructor(app2, plugin2) {
      super(app2, plugin2);
      this.stats = {
        cacheHits: 0,
        cacheMisses: 0,
        elementsProcessed: 0,
        totalProcessingTime: 0
      };
      if (plugin2.measurementCache) {
        const cache = plugin2.measurementCache;
      }
    }
    display() {
      const { containerEl } = this;
      containerEl.empty();
      containerEl.createEl("h2", { text: "Pretext Optimizer" });
      new import_obsidian.Setting(containerEl).setName("Enable Preview Optimization").setDesc("Optimize heavy elements in Markdown preview (callouts, blockquotes, tables).").addToggle((toggle) => toggle.setValue(plugin.settings.enablePreviewOptimization).onChange((value) => {
        plugin.settings.enablePreviewOptimization = value;
        plugin.saveSettings();
      }));
      new import_obsidian.Setting(containerEl).setName("Enable Editor Optimization").setDesc("Optimize editor (source/live preview) via CodeMirror extension (requires Obsidian 1.5+).").addToggle((toggle) => toggle.setValue(plugin.settings.enableEditorOptimization).onChange((value) => {
        plugin.settings.enableEditorOptimization = value;
        plugin.saveSettings();
      }));
      new import_obsidian.Setting(containerEl).setName("Minimum Text Length").setDesc("Only process elements with text longer than this (characters).").addText((text) => text.setValue(String(plugin.settings.minTextLength)).setPlaceholder("50").onChange((value) => {
        const n = parseInt(value, 10);
        if (!isNaN(n) && n > 0) {
          plugin.settings.minTextLength = n;
          plugin.saveSettings();
        }
      }));
      new import_obsidian.Setting(containerEl).setName("Batch Size").setDesc("Max elements per requestIdleCallback batch.").addText((text) => text.setValue(String(plugin.settings.batchSize)).setPlaceholder("5").onChange((value) => {
        const n = parseInt(value, 10);
        if (!isNaN(n) && n > 0) {
          plugin.settings.batchSize = n;
          plugin.saveSettings();
        }
      }));
      containerEl.createEl("h3", { text: "Cache" });
      new import_obsidian.Setting(containerEl).setName("Cache Size").setDesc("Maximum number of cached measurements.").addText((text) => text.setValue(String(plugin.settings.cacheSize)).setPlaceholder("1000").onChange((value) => {
        var _a;
        const n = parseInt(value, 10);
        if (!isNaN(n) && n > 0) {
          plugin.settings.cacheSize = n;
          plugin.saveSettings();
          (_a = plugin.measurementCache) == null ? void 0 : _a.setMaxSize(n);
        }
      }));
      new import_obsidian.Setting(containerEl).setName("Clear All Caches").setDesc("Clear measurement cache, font info cache, and Pretext internal cache.").addButton((button) => button.setButtonText("Clear").onClick(() => {
        var _a, _b;
        (_a = plugin.measurementCache) == null ? void 0 : _a.clear();
        invalidateFontCache();
        (_b = plugin.pretextManager) == null ? void 0 : _b.clearCache();
      }));
      containerEl.createEl("h3", { text: "Statistics" });
      const statsEl = containerEl.createDiv("optimizer-stats");
      const refreshStats = () => {
        var _a, _b, _c;
        statsEl.empty();
        const cacheStats = (_a = plugin.measurementCache) == null ? void 0 : _a.getStats();
        const rows = [
          ["Cache hits", String((_b = cacheStats == null ? void 0 : cacheStats.hits) != null ? _b : 0)],
          ["Cache misses", String((_c = cacheStats == null ? void 0 : cacheStats.misses) != null ? _c : 0)],
          ["Cache hit rate", (cacheStats == null ? void 0 : cacheStats.total) ? `${(cacheStats.hits / cacheStats.total * 100).toFixed(1)}%` : "\u2014"],
          ["Elements processed", String(plugin.elementsProcessedCount)],
          ["Total processing time", `${plugin.totalProcessingTime.toFixed(1)} ms`]
        ];
        const table = statsEl.createEl("table");
        for (const [key, value] of rows) {
          const tr = table.createEl("tr");
          tr.createEl("td", { text: key, cls: "pretext-stat-label" });
          tr.createEl("td", { text: value, cls: "pretext-stat-value" });
        }
      };
      refreshStats();
      const intervalId = setInterval(refreshStats, 2e3);
      plugin.register(() => clearInterval(intervalId));
      new import_obsidian.Setting(containerEl).addButton((button) => button.setButtonText("Refresh Stats").onClick(refreshStats));
    }
  }(app, plugin);
}

// main.ts
var DEFAULT_SETTINGS = {
  enablePreviewOptimization: true,
  enableEditorOptimization: true,
  minTextLength: 50,
  batchSize: 5,
  cacheSize: 1e3
};
var ObsidianPretextPlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
    this.elementsProcessedCount = 0;
    this.totalProcessingTime = 0;
    this.processingFlag = false;
    // Throttle: RAF handle for observeHeavyElements
    this.rafId = null;
    // Track which elements are already observed to avoid duplicates
    this.observedElements = /* @__PURE__ */ new WeakSet();
  }
  async onload() {
    await this.loadSettings();
    logger.info("Loading plugin...");
    this.pretextManager = new PretextManager(this.measurementCache);
    await this.pretextManager.initialize();
    if (!this.pretextManager.isReady()) {
      logger.warn("Pretext not available. Plugin will not provide optimization.");
    }
    this.registerMarkdownPostProcessor(
      createMarkdownPostProcessor(
        this.pretextManager,
        this.measurementCache,
        (elapsedMs) => {
          this.elementsProcessedCount++;
          this.totalProcessingTime += elapsedMs;
        }
      ),
      100
    );
    this.tryRegisterCodeMirrorExtension();
    this.initializeResizeObserver();
    this.addSettingTab(createSettingsTab(this.app, this));
    logger.info("Plugin loaded successfully.");
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.measurementCache = new MeasurementCache(this.settings.cacheSize);
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  tryRegisterCodeMirrorExtension() {
    if (typeof this.registerCodeMirrorExtension === "function") {
      try {
        const extension = createPretextCodeMirrorExtension(this.pretextManager, this.measurementCache);
        this.registerCodeMirrorExtension(extension);
        logger.info("CodeMirror extension registered.");
      } catch (err) {
        logger.warn("CodeMirror extension not available:", err);
      }
    } else {
      logger.info("CodeMirror extension not supported in this Obsidian version (requires 1.5+).");
    }
  }
  initializeResizeObserver() {
    if (!this.pretextManager.isReady()) {
      return;
    }
    this.resizeObserver = new ResizeObserver((entries) => {
      this.processingFlag = true;
      try {
        entries.forEach((entry) => {
          const el = entry.target;
          const currentWidth = entry.contentRect.width;
          const previousWidth = parseFloat(el.getAttribute("data-pretext-width") || "0");
          if (Math.abs(currentWidth - previousWidth) > 10) {
            processHeavyElement(
              el,
              this.pretextManager,
              this.measurementCache,
              currentWidth,
              (elapsedMs) => {
                this.elementsProcessedCount++;
                this.totalProcessingTime += elapsedMs;
              }
            );
          }
        });
      } finally {
        this.processingFlag = false;
      }
    });
    this.observeHeavyElements();
    this.setupViewObservers();
  }
  /**
   * Set up MutationObservers for view containers.
   * Observes .markdown-preview-view and .markdown-source-view instances.
   */
  setupViewObservers() {
    const observeContainer = (container) => {
      const observer = new MutationObserver((mutations) => {
        if (this.processingFlag) return;
        const newHeavyElements = [];
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            for (const node of mutation.addedNodes) {
              if (node instanceof Element) {
                const combinedSelector = HEAVY_SELECTORS.join(", ");
                if (node.matches(combinedSelector)) {
                  newHeavyElements.push(node);
                }
                const matches = node.querySelectorAll(combinedSelector);
                matches.forEach((el) => newHeavyElements.push(el));
              }
            }
          }
        }
        if (newHeavyElements.length > 0 && this.rafId === null) {
          this.rafId = requestAnimationFrame(() => {
            this.rafId = null;
            this.observeNewElements(newHeavyElements);
          });
        }
      });
      observer.observe(container, { childList: true, subtree: false });
      this.register(() => observer.disconnect());
    };
    const existingContainers = document.querySelectorAll(".markdown-preview-view, .markdown-source-view");
    existingContainers.forEach((container) => observeContainer(container));
    const containerObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
              if (node.matches(".markdown-preview-view, .markdown-source-view")) {
                observeContainer(node);
              }
              const nested = node.querySelectorAll(".markdown-preview-view, .markdown-source-view");
              nested.forEach((n) => observeContainer(n));
            }
          }
        }
      }
    });
    containerObserver.observe(document.body, { childList: true, subtree: false });
    this.register(() => containerObserver.disconnect());
  }
  observeHeavyElements() {
    if (!this.resizeObserver || !this.pretextManager.isReady()) {
      return;
    }
    const combinedSelector = HEAVY_SELECTORS.join(", ");
    const elements = document.querySelectorAll(combinedSelector);
    elements.forEach((el) => {
      if (this.observedElements.has(el)) {
        return;
      }
      const currentWidth = el.clientWidth;
      const previousWidth = parseFloat(el.getAttribute("data-pretext-width") || "0");
      if (!el.hasAttribute("data-pretext-optimized") || Math.abs(currentWidth - previousWidth) > 10) {
        this.observedElements.add(el);
        this.resizeObserver.observe(el);
      }
    });
  }
  /**
   * Observe newly added heavy elements (local scan, not full document).
   */
  observeNewElements(elements) {
    if (!this.resizeObserver || !this.pretextManager.isReady()) {
      return;
    }
    for (const el of elements) {
      if (this.observedElements.has(el)) {
        continue;
      }
      this.observedElements.add(el);
      this.resizeObserver.observe(el);
    }
  }
  onunload() {
    var _a, _b, _c;
    logger.info("Unloading plugin...");
    (_a = this.pretextManager) == null ? void 0 : _a.clearCache();
    (_b = this.measurementCache) == null ? void 0 : _b.clear();
    (_c = this.resizeObserver) == null ? void 0 : _c.disconnect();
  }
};

/* nosourcemap */