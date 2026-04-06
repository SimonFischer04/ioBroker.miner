import { Level } from './Level';

type LoggerType = {
    log: (level: Level, message: string) => void;
};

/**
 *
 */
export function consoleLogger(): LoggerType {
    return {
        log: (level: Level, message: string) => {
            switch (level) {
                case Level.DEBUG:
                    console.debug(message);
                    break;
                case Level.INFO:
                    console.info(message);
                    break;
                case Level.NOTICE:
                    console.info(message);
                    break;
                case Level.WARN:
                    console.warn(message);
                    break;
                case Level.ERROR:
                    console.error(message);
                    break;
                case Level.FATAL:
                    console.error(message);
                    break;
            }
        },
    };
}

/**
 *
 */
export class Logger {
    static logger: LoggerType = consoleLogger();

    /**
     *
     * @param name - the logger name prefix
     */
    static getLogger(name: string): Logger {
        return new Logger(name);
    }

    /**
     *
     * @param logger - the logger implementation to use
     */
    static setLogger(logger: LoggerType): void {
        Logger.logger = logger;
    }

    private constructor(private readonly name: string) {}

    /**
     *
     * @param message - the message to log
     */
    public log(message: string): void {
        this.logWithLevel(Level.INFO, message);
    }

    /**
     *
     * @param message - the debug message to log
     */
    public debug(message: string): void {
        this.logWithLevel(Level.DEBUG, message);
    }

    /**
     *
     * @param message - the info message to log
     */
    public info(message: string): void {
        this.logWithLevel(Level.INFO, message);
    }

    /**
     *
     * @param message - the notice message to log
     */
    public notice(message: string): void {
        this.logWithLevel(Level.NOTICE, message);
    }

    /**
     *
     * @param message - the warning message to log
     */
    public warn(message: string): void {
        this.logWithLevel(Level.WARN, message);
    }

    /**
     *
     * @param message - the error message to log
     */
    public error(message: string): void {
        this.logWithLevel(Level.ERROR, message);
    }

    /**
     *
     * @param message - the fatal message to log
     */
    public fatal(message: string): void {
        this.logWithLevel(Level.FATAL, message);
    }

    private logWithLevel(level: Level, message: string): void {
        Logger.logger.log(level, `[${this.name}] ${Level[level]}: ${message}`);
    }
}
