import { signalBus } from './api-utils';

/**
 * Studio Logger Utility
 * Provides styled console logging for the Anime Script Pro environment.
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
  timestamp: 'color: #64748b; font-size: 10px; font-family: monospace;'
};

export type LogLevel = 'anime' | 'manhwa' | 'comic' | 'system' | 'success' | 'error' | 'warn' | 'info';

export interface StudioLogEvent {
  module: string;
  message: string;
  level: LogLevel;
  timestamp: string;
  data?: any;
}

const lastLogs = new Map<string, number>();

export const studioLog = (module: string, message: string, level: LogLevel = 'info', data?: any) => {
  const now = Date.now();
  const signature = `${module}:${message}`;
  
  // Deduplication: Prevent double-logging within 150ms
  if (lastLogs.has(signature) && now - lastLogs.get(signature)! < 150) {
    return;
  }
  lastLogs.set(signature, now);

  const timestamp = new Date().toLocaleTimeString();
  const moduleStyle = STYLES[level] || STYLES.info;
  const label = module.toUpperCase().padEnd(10); // Fixed width for alignment

  // Determine arrow based on level/type
  const isAction = level === 'anime' || level === 'manhwa' || level === 'comic' || 
                   message.toLowerCase().includes('initializing') || 
                   message.toLowerCase().includes('trigger') ||
                   message.toLowerCase().includes('requesting') ||
                   message.toLowerCase().includes('starting');
  
  const arrow = isAction ? 'TRIGGER ->' : 'RESULT  <-';

  // Dispatch to UI Console (keeping original message for UI)
  signalBus.dispatchEvent(new CustomEvent('studio_log', {
    detail: { module, message: `${arrow} ${message}`, level, timestamp, data } as StudioLogEvent
  }));

  if (level === 'error') {
    console.group(`%c[${label}] %cCRITICAL !! %c${message} %c@ ${timestamp}`, moduleStyle, STYLES.error, 'color: inherit;', STYLES.timestamp);
    if (data) console.error(data);
    console.groupEnd();
  } else if (level === 'warn') {
    console.warn(`%c[${label}] %cWARNING  !! %c${message} %c@ ${timestamp}`, moduleStyle, STYLES.warn, 'color: inherit;', STYLES.timestamp);
  } else {
    console.log(
      `%c[${label}] %c${arrow} %c${message} %c@ ${timestamp}`,
      moduleStyle,
      'color: #94a3b8; font-weight: bold;',
      'color: inherit;',
      STYLES.timestamp
    );
    if (data) console.dir(data);
  }
};

export const studioGroup = (module: string, title: string, level: LogLevel = 'info') => {
  const now = Date.now();
  const signature = `${module}:GROUP:${title}`;
  
  if (lastLogs.has(signature) && now - lastLogs.get(signature)! < 150) {
    return;
  }
  lastLogs.set(signature, now);

  const moduleStyle = STYLES[level] || STYLES.info;
  const label = module.toUpperCase().padEnd(10);
  console.groupCollapsed(`%c[${label}] %cTRACE   -> %c${title}`, moduleStyle, 'color: #94a3b8; font-weight: bold;', 'font-weight: bold; color: #fff; text-transform: uppercase;');
};

export const studioEnd = () => {
  console.groupEnd();
};

export const studioTable = (module: string, title: string, data: any, level: LogLevel = 'info') => {
  const moduleStyle = STYLES[level] || STYLES.info;
  const label = module.toUpperCase().padEnd(10);
  console.log(`%c[${label}] %cRESULT  <- %c${title}`, moduleStyle, 'color: #94a3b8; font-weight: bold;', 'font-weight: bold;');
  console.table(data);
};

export const reportTabChange = (module: string, tabName: string, level: LogLevel = 'anime') => {
  studioLog(module, `Navigation protocol switched to: ${tabName.toUpperCase()}`, level);
};

export const reportGeneration = (module: string, action: string, status: 'request' | 'success' | 'failure', level: LogLevel = 'anime', data?: any) => {
  const message = status === 'request'
    ? `Initializing ${action}...`
    : status === 'success'
      ? `${action} completed successfully.`
      : `Failed to complete ${action}.`;

  const logLevel = status === 'failure' ? 'error' : (status === 'success' ? 'success' : level);
  studioLog(module, message, logLevel as LogLevel, data);
};

