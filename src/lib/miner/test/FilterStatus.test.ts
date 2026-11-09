import { expect } from 'chai';
import { DEFAULT_FILTER_CLEAN_INTERVAL_DAYS, isFilterCleanDue } from '../model/FilterStatus';

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

        it('is never due when the reminder is off', () => {
            expect(isFilterCleanDue(1_000_000, 0)).to.equal(false);
        });
    });
});
