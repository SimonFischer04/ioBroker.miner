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
     */
    static getLogger(name: string): Logger {
        return new Logger(name);
    }

    /**
     *
     */
    static setLogger(logger: LoggerType): void {
        Logger.logger = logger;
    }

    private constructor(private readonly name: string) {}

    /**
     *
     */
    public log(message: string): void {
        this.logWithLevel(Level.INFO, message);
    }

    /**
     *
     */
    public debug(message: string): void {
        this.logWithLevel(Level.DEBUG, message);
    }

    /**
     *
     */
    public info(message: string): void {
        this.logWithLevel(Level.INFO, message);
    }

    /**
     *
     */
    public notice(message: string): void {
        this.logWithLevel(Level.NOTICE, message);
    }

    /**
     *
     */
    public warn(message: string): void {
        this.logWithLevel(Level.WARN, message);
    }

    /**
     *
     */
    public error(message: string): void {
        this.logWithLevel(Level.ERROR, message);
    }

    /**
     *
     */
    public fatal(message: string): void {
        this.logWithLevel(Level.FATAL, message);
    }

    private logWithLevel(level: Level, message: string): void {
        Logger.logger.log(level, `[${this.name}] ${Level[level]}: ${message}`);
    }
}
