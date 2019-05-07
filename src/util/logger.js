/* eslint-disable no-console */

/**
 * Utility function to log something
 * @param {string} message Message(s) to log
 * @param {string} level Log level
 */
const log = (level, ...message) => process.env.NODE_ENV === "development" && console[level](...message);

/**
 * Utility class to log messages in development mode
 */
export class Logger {
    /**
     * Logs message in development mode
     * @param {string} message Message(s) to log
     */
    static debug(...message) {
        log("debug", ...message);
    }

    /**
     * Logs error message in development mode
     * @param {string} message Message(s) to log
     */
    static error(...message) {
        log("error", ...message);
    }

    /**
     * Logs warning message in development mode
     * @param {string} message Message(s) to log
     */
    static warn(...message) {
        log("warn", ...message);
    }
}

export default Logger;
