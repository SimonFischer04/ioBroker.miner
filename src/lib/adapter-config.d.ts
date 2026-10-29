// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
    namespace ioBroker {
        interface AdapterConfig {
            pollInterval: number;
            /** Look up the latest firmware/software versions once a day (default: true). */
            checkForUpdates?: boolean;
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};