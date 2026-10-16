import { expect } from 'chai';
import {
    parseAvalonCgiResponse,
    AvalonWebAuthClient,
    type AvalonAuthResponse,
    type AvalonLoginResponse,
} from '../api/AvalonWebAuthClient';

describe('AvalonWebAuthClient', () => {
    describe('parseAvalonCgiResponse', () => {
        it('should parse getAuthCallback response', () => {
            const raw = 'getAuthCallback({"auth":"abc123def"})';
            const result = parseAvalonCgiResponse<AvalonAuthResponse>(raw);
            expect(result).to.deep.equal({ auth: 'abc123def' });
        });

        it('should parse getCookieCallback response', () => {
            const raw = 'getCookieCallback({"auth":"abc123","code":"xyz789"})';
            const result = parseAvalonCgiResponse<AvalonLoginResponse>(raw);
            expect(result).to.deep.equal({ auth: 'abc123', code: 'xyz789' });
        });

        it('should return null for empty response', () => {
            expect(parseAvalonCgiResponse('')).to.be.null;
        });

        it('should return null for non-matching response', () => {
            expect(parseAvalonCgiResponse('some random text')).to.be.null;
        });

        it('should return null for invalid JSON in callback', () => {
            expect(parseAvalonCgiResponse('callback({invalid json})')).to.be.null;
        });

        it('should handle multiline response', () => {
            const raw = 'getAuthCallback({\n  "auth": "token123"\n})';
            const result = parseAvalonCgiResponse<AvalonAuthResponse>(raw);
            expect(result).to.deep.equal({ auth: 'token123' });
        });
    });

    describe('static methods', () => {
        it('buildAuthCookie should concatenate auth and code', () => {
            const cookie = AvalonWebAuthClient.buildAuthCookie({ auth: 'abc', code: 'xyz' });
            expect(cookie).to.equal('abcxyz');
        });

        it('getQrCodeContent should return JSON string of auth response', () => {
            const content = AvalonWebAuthClient.getQrCodeContent({ auth: 'token123' });
            expect(content).to.equal('{"auth":"token123"}');
        });
    });
});
