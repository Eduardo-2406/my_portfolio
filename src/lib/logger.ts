/**
 * Logger utility for development and production environments.
 * Only logs in development mode to avoid console pollution in production.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, ...args: unknown[]): void {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'info':
        console.log(prefix, ...args);
        break;
      case 'warn':
        console.warn(prefix, ...args);
        break;
      case 'error':
        console.error(prefix, ...args);
        break;
      case 'debug':
        console.debug(prefix, ...args);
        break;
    }
  }

  /**
   * Log informational messages
   */
  info(...args: unknown[]): void {
    this.log('info', ...args);
  }

  /**
   * Log warning messages
   */
  warn(...args: unknown[]): void {
    this.log('warn', ...args);
  }

  /**
   * Log error messages
   */
  error(...args: unknown[]): void {
    this.log('error', ...args);
  }

  /**
   * Log debug messages
   */
  debug(...args: unknown[]): void {
    this.log('debug', ...args);
  }
}

export const logger = new Logger();
