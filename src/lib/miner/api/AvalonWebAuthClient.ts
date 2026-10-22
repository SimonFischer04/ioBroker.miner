import type { Logger } from '../model/Logger';

/**
 * Response from the Avalon `get_auth.cgi` endpoint.
 * The CGI returns JavaScript that calls `getAuthCallback({auth: "..."})`.
 */
export interface AvalonAuthResponse {
    /**
     *
     */
    auth: string;
}

/**
 * Response from the Avalon `is_login.cgi` endpoint when authenticated.
 * The CGI returns JavaScript that calls `getCookieCallback({auth: "...", code: "..."})`.
 */
export interface AvalonLoginResponse {
    /**
     *
     */
    auth: string;
    /**
     *
     */
    code: string;
}

/**
 * Parses the JavaScript callback response from Avalon CGI endpoints.
 *
 * The Avalon device returns responses as JavaScript function calls like:
 * `getAuthCallback({"auth":"abc123"})` or `getCookieCallback({"auth":"abc","code":"xyz"})`
 *
 * @param responseText - raw response text from the CGI endpoint
 * @returns parsed JSON object from the callback argument, or null if parsing fails
 */
export function parseAvalonCgiResponse<T>(responseText: string): T | null {
    // Match pattern: functionName({...})
    const match = responseText.match(/\w+\((\{.*\})\)/s);
    if (!match?.[1]) {
        return null;
    }
    try {
        return JSON.parse(match[1]) as T;
    } catch {
        return null;
    }
}

/**
 * Client for the Avalon device web authentication flow.
 *
 * The Avalon web interface uses a QR-code-based login:
 * 1. `GET /get_auth.cgi` returns an auth token
 * 2. The token is displayed as a QR code for the user to scan with the Avalon app
 * 3. The app confirms authentication on the device
 * 4. `GET /is_login.cgi` returns auth + code once confirmed
 * 5. The cookie `auth=<auth><code>` is used for subsequent requests
 *
 * This client implements steps 1, 3-5 programmatically so the adapter can
 * expose the auth token (for QR display in the ioBroker UI) and poll for completion.
 */
export class AvalonWebAuthClient {
    private readonly baseUrl: string;

    /**
     * @param host - device IP/hostname
     * @param port - web interface port (typically 80)
     * @param logger - logger instance
     */
    constructor(
        private readonly host: string,
        private readonly port: number,
        private readonly logger: Logger,
    ) {
        this.baseUrl = `http://${host}:${port}`;
    }

    /**
     * Request an auth token from the device.
     * This token should be displayed as a QR code for the user to scan.
     *
     * @returns the auth response containing the token, or null on failure
     */
    public async getAuth(): Promise<AvalonAuthResponse | null> {
        try {
            const response = await fetch(`${this.baseUrl}/get_auth.cgi?num=${Math.random()}`);
            if (!response.ok) {
                this.logger.error(`get_auth.cgi failed with status ${response.status}`);
                return null;
            }
            const text = await response.text();
            const parsed = parseAvalonCgiResponse<AvalonAuthResponse>(text);
            if (!parsed?.auth) {
                this.logger.debug(`get_auth.cgi returned unexpected response: ${text}`);
                return null;
            }
            return parsed;
        } catch (e) {
            this.logger.error(`get_auth.cgi request failed: ${String(e)}`);
            return null;
        }
    }

    /**
     * Check if the login has been confirmed (user scanned the QR code with the app).
     *
     * @returns the login response with auth+code if authenticated, or null if not yet
     */
    public async checkLogin(): Promise<AvalonLoginResponse | null> {
        try {
            const response = await fetch(`${this.baseUrl}/is_login.cgi?num=${Math.random()}`);
            if (!response.ok) {
                this.logger.debug(`is_login.cgi returned status ${response.status}`);
                return null;
            }
            const text = await response.text();
            const parsed = parseAvalonCgiResponse<AvalonLoginResponse>(text);
            if (!parsed?.auth || !parsed?.code) {
                return null;
            }
            return parsed;
        } catch (e) {
            this.logger.error(`is_login.cgi request failed: ${String(e)}`);
            return null;
        }
    }

    /**
     * Build the auth cookie value from a successful login response.
     *
     * @param loginResponse - the response from a successful checkLogin() call
     * @returns cookie value string
     */
    public static buildAuthCookie(loginResponse: AvalonLoginResponse): string {
        return `${loginResponse.auth}${loginResponse.code}`;
    }

    /**
     * Get the QR code content string that should be displayed to the user.
     * The user scans this with the Avalon Family APP to authenticate.
     *
     * @param authResponse - response from getAuth()
     * @returns JSON string to encode as QR code
     */
    public static getQrCodeContent(authResponse: AvalonAuthResponse): string {
        return JSON.stringify(authResponse);
    }
}
