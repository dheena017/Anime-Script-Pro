/**
 * Dev Console Logs Utility
 * Shared logging, grouping, tab reporting, and event dispatch for the studio UI.
 */

const STYLES = {
  anime: 'color: #06b6d4; font-weight: bold; background: rgba(6, 182, 212, 0.1); padding: 2px 4px; border-radius: 4px;',
  manhwa: 'color: #8b5cf6; font-weight: bold; background: rgba(139, 92, 246, 0.1); padding: 2px 4px; border-radius: 4px;',
  comic: 'color: #f59e0b; font-weight: bold; background: rgba(245, 158, 11, 0.1); padding: 2px 4px; border-radius: 4px;',
  system: 'color: #ef4444; font-weight: bold; background: rgba(239, 68, 68, 0.1); padding: 2px 4px; border-radius: 4px;',
  success: 'color: #10b981; font-weight: bold;',
  error: 'color: #ef4444; font-weight: bold;',
  warn: 'color: #f59e0b; font-weight: bold;',
  info: 'color: #94a3b8; font-weight: normal;',
  timestamp: 'color: #64748b; font-size: 10px; font-family: monospace;',
  dim: 'color: #64748b; font-weight: 500;',
  glass: 'color: #e2e8f0; font-weight: 700; background: rgba(255,255,255,0.06); padding: 2px 8px; border: 1px solid rgba(255,255,255,0.08); border-radius: 999px;',
  neon: 'color: #67e8f9; font-weight: 800; text-shadow: 0 0 12px rgba(103,232,249,0.35);',
  matrix: 'color: #22c55e; font-weight: 700; text-shadow: 0 0 10px rgba(34,197,94,0.25);',
  muted: 'color: #9ca3af; font-weight: 500; opacity: 0.7;',
} as const;

export type LogLevel = 'anime' | 'manhwa' | 'comic' | 'system' | 'success' | 'error' | 'warn' | 'info';

export interface StudioLogEvent {
  id: string;
  sequence: number;
  module: string;
  message: string;
  level: LogLevel;
  timestamp: string;
  source?: string;
  category?: string;
  action?: string;
  tags?: string[];
  correlationId?: string;
  summary?: string;
  context?: Record<string, unknown>;
  data?: any;
}

export interface NeuralSignalEvent {
  signalId: string;
  method: string;
  url: string;
  status: number;
  duration: number;
  source?: string;
  category?: string;
  summary?: string;
  tags?: string[];
}

export interface DevConsoleMeta {
  source?: string;
  category?: string;
  action?: string;
  tags?: string[];
  correlationId?: string;
  summary?: string;
  context?: Record<string, unknown>;
}

export const signalBus = new EventTarget();

const lastLogs = new Map<string, number>();
const logHistory: StudioLogEvent[] = [];
const logLevelCounts: Record<LogLevel, number> = {
  anime: 0,
  manhwa: 0,
  comic: 0,
  system: 0,
  success: 0,
  error: 0,
  warn: 0,
  info: 0,
};
const logModuleCounts = new Map<string, number>();
const historyLimit = 200;
let logSequence = 0;
let persistTimer: number | null = null;

const schedulePersistLogHistory = (delay = 500) => {
  if (persistTimer !== null) {
    window.clearTimeout(persistTimer);
  }
  persistTimer = window.setTimeout(() => {
    persistLogHistory();
    persistTimer = null;
  }, delay);
};

export interface DevConsoleSnapshot {
  total: number;
  byLevel: Record<LogLevel, number>;
  byModule: Array<[string, number]>;
  recent: StudioLogEvent[];
}

export interface LogQueryOptions {
  module?: string;
  level?: LogLevel | LogLevel[];
  category?: string;
  action?: string;
  tag?: string;
  search?: string;
  limit?: number;
}

export interface LogImportPayload {
  version?: number;
  logs: StudioLogEvent[];
}

const LOG_STORAGE_KEY = 'anime-script-pro.dev-console-history.v1';

const shouldTreatAsAction = (level: LogLevel, message: string) => {
  const lowerMessage = message.toLowerCase();
  return (
    level === 'anime' ||
    level === 'manhwa' ||
    level === 'comic' ||
    lowerMessage.includes('initializing') ||
    lowerMessage.includes('trigger') ||
    lowerMessage.includes('requesting') ||
    lowerMessage.includes('starting')
  );
};

const pushLogHistory = (entry: StudioLogEvent) => {
  logHistory.push(entry);
  if (logHistory.length > historyLimit) {
    logHistory.splice(0, logHistory.length - historyLimit);
  }

  logLevelCounts[entry.level] += 1;
  logModuleCounts.set(entry.module, (logModuleCounts.get(entry.module) || 0) + 1);
  schedulePersistLogHistory();
};

export const getLogHistory = (limit = 50) => logHistory.slice(-limit);

export const getLogCounts = () => ({
  total: logHistory.length,
  byLevel: { ...logLevelCounts },
  byModule: Array.from(logModuleCounts.entries()),
});

export const getLogSnapshot = (limit = 50): DevConsoleSnapshot => ({
  total: logHistory.length,
  byLevel: { ...logLevelCounts },
  byModule: Array.from(logModuleCounts.entries()),
  recent: getLogHistory(limit),
});

export const queryLogHistory = (options: LogQueryOptions = {}): StudioLogEvent[] => {
  const { module, level, category, action, tag, search, limit } = options;
  const levelList = Array.isArray(level) ? level : level ? [level] : null;
  const searchTerm = search?.trim().toLowerCase();

  const filtered = logHistory.filter((entry) => {
    if (module && entry.module !== module) return false;
    if (levelList && !levelList.includes(entry.level)) return false;
    if (category && entry.category !== category) return false;
    if (action && entry.action !== action) return false;
    if (tag && !entry.tags?.includes(tag)) return false;
    if (!searchTerm) return true;

    const haystack = [
      entry.module,
      entry.message,
      entry.summary,
      entry.source,
      entry.category,
      entry.action,
      entry.correlationId,
      entry.tags?.join(' '),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(searchTerm);
  });

  return typeof limit === 'number' ? filtered.slice(-limit) : filtered;
};

export const getRecentErrors = (limit = 20) => queryLogHistory({ level: 'error', limit });

export const getTopModules = (limit = 10) =>
  Array.from(logModuleCounts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit);

export const getLevelTrend = () => ({
  error: logLevelCounts.error,
  warn: logLevelCounts.warn,
  success: logLevelCounts.success,
  info: logLevelCounts.info,
});

export const getLogDigest = () => ({
  generatedAt: new Date().toISOString(),
  snapshot: getLogSnapshot(100),
  topModules: getTopModules(10),
  recentErrors: getRecentErrors(10),
  trend: getLevelTrend(),
});

export const exportLogHistory = () => JSON.stringify({
  version: 1,
  generatedAt: new Date().toISOString(),
  logs: logHistory,
}, null, 2);

export const importLogHistory = (payload: string | LogImportPayload) => {
  const parsed = typeof payload === 'string' ? JSON.parse(payload) as LogImportPayload : payload;
  const importedLogs = Array.isArray(parsed?.logs) ? parsed.logs : [];

  clearLogHistory();
  importedLogs.forEach((log) => {
    logHistory.push(log);
    logLevelCounts[log.level] += 1;
    logModuleCounts.set(log.module, (logModuleCounts.get(log.module) || 0) + 1);
    logSequence = Math.max(logSequence, log.sequence || 0);
  });

  return getLogSnapshot();
};

export const persistLogHistory = (storageKey = LOG_STORAGE_KEY) => {
  try {
    localStorage.setItem(storageKey, exportLogHistory());
    return true;
  } catch {
    return false;
  }
};

export const restoreLogHistory = (storageKey = LOG_STORAGE_KEY) => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return false;
    importLogHistory(stored);
    return true;
  } catch {
    return false;
  }
};

export const createLogTheme = (level: LogLevel, variant: 'pill' | 'soft' | 'text' = 'pill') => {
  const base = STYLES[level] || STYLES.info;
  if (variant === 'text') return base;
  if (variant === 'soft') return `${base} opacity: 0.9;`;
  return `${base}; box-shadow: 0 0 0 1px rgba(255,255,255,0.05) inset;`;
};

export const formatLogLabel = (entry: Pick<StudioLogEvent, 'module' | 'level' | 'sequence'>) => {
  const levelLabel = entry.level.toUpperCase();
  return `${entry.module} #${entry.sequence} ${levelLabel}`;
};

export const describeLog = (entry: StudioLogEvent) => {
  const parts = [entry.summary || entry.message, entry.category, entry.action, entry.source].filter(Boolean);
  return parts.join(' · ');
};

export const clearLogHistory = () => {
  logHistory.length = 0;
  logModuleCounts.clear();
  (Object.keys(logLevelCounts) as LogLevel[]).forEach((level) => {
    logLevelCounts[level] = 0;
  });
  logSequence = 0;
};

export const subscribeToLogs = (listener: (event: StudioLogEvent) => void) => {
  const handler = (event: Event) => listener((event as CustomEvent<StudioLogEvent>).detail);
  signalBus.addEventListener('studio_log', handler);
  return () => signalBus.removeEventListener('studio_log', handler);
};

export const emitNeuralSignal = (signal: NeuralSignalEvent) => {
  signalBus.dispatchEvent(new CustomEvent('neural_signal', { detail: signal }));
};

export const studioLog = (module: string, message: string, level: LogLevel = 'info', data?: any, meta?: DevConsoleMeta) => {
  const now = Date.now();
  const signature = `${module}:${message}`;

  if (lastLogs.has(signature) && now - lastLogs.get(signature)! < 150) {
    return;
  }
  lastLogs.set(signature, now);

  const timestamp = new Date().toLocaleTimeString();
  const moduleStyle = STYLES[level] || STYLES.info;
  const label = module.toUpperCase().padEnd(10);
  const arrow = shouldTreatAsAction(level, message) ? 'TRIGGER ->' : 'RESULT  <-';
  const id = `${module}-${now}-${++logSequence}`;
  const summary = meta?.summary || message;
  const entry: StudioLogEvent = {
    id,
    sequence: logSequence,
    module,
    message: `${arrow} ${message}`,
    level,
    timestamp,
    data,
    source: meta?.source,
    category: meta?.category,
    action: meta?.action,
    tags: meta?.tags,
    correlationId: meta?.correlationId,
    summary,
    context: meta?.context,
  };

  pushLogHistory(entry);

  // Print to the actual browser developer console
  const levelLabel = level.toUpperCase();
  const moduleBadge = module.toUpperCase();

  const levelBg =
    level === 'success' ? '#059669' :
    level === 'anime' || level === 'manhwa' || level === 'comic' || level === 'info' ? '#0891b2' :
    level === 'warn' ? '#d97706' :
    level === 'error' ? '#dc2626' :
    level === 'system' ? '#7c3aed' : '#374151';

  if (level === 'error') {
    console.error(
      `%c ${levelLabel} %c%c ${moduleBadge} %c%c[${timestamp}]%c%c ${arrow} ${message}`,
      `color: #ffffff; background: #dc2626; padding: 2px 6px; border-radius: 4px; font-weight: bold;`,
      '',
      'color: #ffffff; background: #1e1b4b; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      '',
      'color: #6b7280; font-family: monospace;',
      '',
      'color: inherit;',
      data || ''
    );
  } else if (level === 'warn') {
    console.warn(
      `%c ${levelLabel} %c%c ${moduleBadge} %c%c[${timestamp}]%c%c ${arrow} ${message}`,
      `color: #ffffff; background: #d97706; padding: 2px 6px; border-radius: 4px; font-weight: bold;`,
      '',
      'color: #ffffff; background: #1e1b4b; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      '',
      'color: #6b7280; font-family: monospace;',
      '',
      'color: inherit;',
      data || ''
    );
  } else {
    console.log(
      `%c ${levelLabel} %c%c ${moduleBadge} %c%c[${timestamp}]%c%c ${arrow} ${message}`,
      `color: #ffffff; background: ${levelBg}; padding: 2px 6px; border-radius: 4px; font-weight: bold;`,
      '',
      'color: #ffffff; background: #1e1b4b; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      '',
      'color: #6b7280; font-family: monospace;',
      '',
      STYLES[level] || 'color: inherit;',
      data || ''
    );
  }

  signalBus.dispatchEvent(new CustomEvent('studio_log', {
    detail: entry
  }));
};

export const studioGroup = (module: string, title: string, level: LogLevel = 'info', meta?: DevConsoleMeta) => {
  const now = Date.now();
  const signature = `${module}:GROUP:${title}`;

  if (lastLogs.has(signature) && now - lastLogs.get(signature)! < 150) {
    return;
  }
  lastLogs.set(signature, now);

  pushLogHistory({
    id: `${module}-${now}-${++logSequence}`,
    sequence: logSequence,
    module,
    message: `TRACE   -> ${title}`,
    level,
    timestamp: new Date().toLocaleTimeString(),
    source: meta?.source,
    category: meta?.category,
    action: meta?.action,
    tags: meta?.tags,
    correlationId: meta?.correlationId,
    summary: meta?.summary || title,
    context: meta?.context,
  });
};

export const studioEnd = () => {};

export const studioTable = (module: string, title: string, data: any, level: LogLevel = 'info', meta?: DevConsoleMeta) => {
  pushLogHistory({
    id: `${module}-${Date.now()}-${++logSequence}`,
    sequence: logSequence,
    module,
    message: `TABLE   -> ${title}`,
    level,
    timestamp: new Date().toLocaleTimeString(),
    data,
    source: meta?.source,
    category: meta?.category,
    action: meta?.action,
    tags: meta?.tags,
    correlationId: meta?.correlationId,
    summary: meta?.summary || title,
    context: meta?.context,
  });
};

export const reportTabChange = (module: string, tabName: string, level: LogLevel = 'anime', meta?: DevConsoleMeta) => {
  studioLog(module, `Navigation protocol switched to: ${tabName.toUpperCase()}`, level, undefined, {
    ...meta,
    category: meta?.category || 'navigation',
    action: meta?.action || 'tab-change',
    summary: meta?.summary || `Tab changed to ${tabName.toUpperCase()}`,
  });
};

export const reportGeneration = (
  module: string,
  action: string,
  status: 'request' | 'success' | 'failure',
  level: LogLevel = 'anime',
  data?: any,
  meta?: DevConsoleMeta,
) => {
  const message = status === 'request'
    ? `Initializing ${action}...`
    : status === 'success'
      ? `${action} completed successfully.`
      : `Failed to complete ${action}.`;

  const logLevel = status === 'failure' ? 'error' : (status === 'success' ? 'success' : level);
  studioLog(module, message, logLevel as LogLevel, data, {
    ...meta,
    category: meta?.category || 'generation',
    action: meta?.action || action,
    summary: meta?.summary || message,
  });
};
