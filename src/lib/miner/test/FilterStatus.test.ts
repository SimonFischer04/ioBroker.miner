import { expect } from 'chai';
import { DEFAULT_FILTER_CLEAN_INTERVAL_DAYS, formatFilterRuntime, isFilterCleanDue } from '../model/FilterStatus';

const DAY = 24 * 60;

describe('FilterStatus', () => {
    describe('isFilterCleanDue', () => {
        it('is due once the runtime reaches the interval', () => {
            expect(isFilterCleanDue(10 * DAY - 1, 10)).to.equal(false);
            expect(isFilterCleanDue(10 * DAY, 10)).to.equal(true);
        });

        it('uses the default interval when the device settings have none', () => {
            expect(isFilterCleanDue(DEFAULT_FILTER_CLEAN_INTERVAL_DAYS * DAY - 1, undefined)).to.equal(false);
            expect(isFilterCleanDue(DEFAULT_FILTER_CLEAN_INTERVAL_DAYS * DAY, undefined)).to.equal(true);
        });

        it('is unknown when the reminder is off', () => {
            expect(isFilterCleanDue(1_000_000, 0)).to.be.undefined;
        });

        it('is unknown without a runtime', () => {
            expect(isFilterCleanDue(undefined, 10)).to.be.undefined;
            expect(isFilterCleanDue(Number.NaN, 10)).to.be.undefined;
        });
    });

    describe('formatFilterRuntime', () => {
        it('shows days and hours', () => {
            // the Nano 3S fixture: Filter[33862]
            expect(formatFilterRuntime(33862)).to.equal('23 d 12 h');
            expect(formatFilterRuntime(0)).to.equal('0 d 0 h');
        });
    });
});
