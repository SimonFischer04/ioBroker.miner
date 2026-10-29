import { createHash } from 'node:crypto';

// The Avalon web interface (Nano 3 / 3S) has no password form: its login page shows a QR code that the Avalon Family
// app scans to approve the login. The flow, as implemented by the miner firmware
// (https://github.com/Canaan-Creative/avalon_nano3s, cg_miner/web/cgi/cgi.c and cg_miner/cgminer/driver-avalon.c):
//
// 1. The login page calls `GET /get_auth.cgi` and renders the reply `{"auth": <random>, "code": <sha_dna>}` as QR code.
// 2. The app answers with the cgminer API command `ascset|0,qr_auth,<random>,<verify>` (port 4028), where `verify`
//    proves knowledge of the miner's web password (see computeQrAuthVerify).
// 3. The login page polls `GET /is_login.cgi` every 5 seconds; once the login was approved, the miner answers with the
//    session cookie and the browser is logged in.
//
// The adapter can do step 2 itself, so a browser can be logged in without the app.

/**
 * What the miner's login page puts into its QR code, as returned by `get_auth.cgi`.
 */
export interface AvalonAuthChallenge {
    /**
     * Random value the miner expects back unchanged.
     */
    auth: string;
    /**
     * Hash of the device DNA, the salt for the password proof.
     */
    code: string;
}

/**
 * Fixed prefix of the password proof (WEBPASS_SIGN_MINI3_STR in the firmware).
 */
const VERIFY_PREFIX = 'ff0000ee';

/**
 * Number of hex characters of a SHA-256 hash the firmware uses (WEB_PASSWD_LEN).
 */
const HASH_PREFIX_LENGTH = 24;

/**
 * Parses the reply of `get_auth.cgi`. It is a JavaScript callback rather than JSON (it even has a trailing comma):
 * `getAuthCallback ({ "auth":"<random>", "code":"<sha_dna>", });`
 *
 * @param body - the raw response body
 */
export function parseAuthChallenge(body: string): AvalonAuthChallenge {
    const auth = /"auth"\s*:\s*"([0-9a-fA-F]+)"/.exec(body)?.[1];
    const code = /"code"\s*:\s*"([0-9a-fA-F]+)"/.exec(body)?.[1];
    if (!auth || !code) {
        throw new Error(`unexpected get_auth.cgi response: ${body.slice(0, 200)}`);
    }
    return { auth, code };
}

function sha256Hex(value: string): string {
    return createHash('sha256').update(value, 'utf8').digest('hex');
}

/**
 * Computes the password proof the miner checks in `ascset|0,qr_auth,...`:
 * `ff0000ee` + the first 24 hex characters of SHA-256(code + the first 24 hex characters of SHA-256(password)).
 * The miner stores its web password only as SHA-256 hex, which is why it is hashed twice.
 *
 * @param code - the `code` of the challenge
 * @param password - the miner's web password, as set in the Avalon Family app
 */
export function computeQrAuthVerify(code: string, password: string): string {
    const storedPassword = sha256Hex(password);
    return VERIFY_PREFIX + sha256Hex(code + storedPassword.slice(0, HASH_PREFIX_LENGTH)).slice(0, HASH_PREFIX_LENGTH);
}

/**
 * The `ascset` parameter that approves the pending web login.
 *
 * @param challenge - the challenge from `get_auth.cgi`
 * @param password - the miner's web password
 */
export function buildQrAuthParameter(challenge: AvalonAuthChallenge, password: string): string {
    return `0,qr_auth,${challenge.auth},${computeQrAuthVerify(challenge.code, password)}`;
}

/**
 * Whether an error message of the `qr_auth` command means the web password was wrong ("passwd error 02!").
 *
 * @param message - the `Msg` of the error status
 */
export function isWrongPasswordError(message: string): boolean {
    return message.includes('passwd error');
}
