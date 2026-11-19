import { expect } from 'chai';
import { formatHashrate, parseNumber, toHashesPerSecond } from './hashrate-utils';

describe('hashrate-utils', () => {
    describe('toHashesPerSecond', () => {
        it('converts the units the pool APIs use', () => {
            expect(toHashesPerSecond(27978, 'Gh/s')).to.equal(27978e9);
            expect(toHashesPerSecond(1.5, 'TH/s')).to.equal(1.5e12);
            expect(toHashesPerSecond(42, 'h/s')).to.equal(42);
            expect(toHashesPerSecond(3, 'MH')).to.equal(3e6);
        });

        it('accepts numeric strings', () => {
            expect(toHashesPerSecond('27978', 'Gh/s')).to.equal(27978e9);
        });

        it('returns undefined for unknown units or values', () => {
            expect(toHashesPerSecond(1, 'Sol/s')).to.equal(undefined);
            expect(toHashesPerSecond(1, undefined)).to.equal(undefined);
            expect(toHashesPerSecond('n/a', 'Gh/s')).to.equal(undefined);
            expect(toHashesPerSecond(null, 'Gh/s')).to.equal(undefined);
        });
    });

    describe('parseNumber', () => {
        it('parses BTC amounts sent as strings', () => {
            expect(parseNumber('0.00011940')).to.equal(0.0001194);
            expect(parseNumber(2)).to.equal(2);
        });

        it('returns undefined for empty or non-numeric values', () => {
            expect(parseNumber('')).to.equal(undefined);
            expect(parseNumber('abc')).to.equal(undefined);
            expect(parseNumber(Number.NaN)).to.equal(undefined);
            expect(parseNumber(undefined)).to.equal(undefined);
        });
    });

    describe('formatHashrate', () => {
        it('picks a fitting unit', () => {
            expect(formatHashrate(27978e9)).to.equal('27.98 TH/s');
            expect(formatHashrate(500)).to.equal('500 H/s');
            expect(formatHashrate(1e15)).to.equal('1 PH/s');
        });

        it('switches to the next unit when the value rounds up to 1000', () => {
            expect(formatHashrate(999999)).to.equal('1 MH/s');
            expect(formatHashrate(999.996)).to.equal('1 kH/s');
            expect(formatHashrate(999.99)).to.equal('999.99 H/s');
        });
    });
});
