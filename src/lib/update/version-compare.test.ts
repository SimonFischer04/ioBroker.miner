import { expect } from 'chai';
import {
    compareBraiinsBuild,
    compareSemver,
    extractSemver,
    parseAvalonBuild,
    parseIceRiverOcVersion,
} from './version-compare';

describe('version-compare', () => {
    describe('extractSemver', () => {
        it('finds the version in tags and free text', () => {
            expect(extractSemver('v6.26.0')).to.equal('6.26.0');
            expect(extractSemver('TeamRedMiner 0.10.21 - ETH')).to.equal('0.10.21');
            expect(extractSemver('9.3 - ETH')).to.equal('9.3');
        });

        it('returns undefined without a version', () => {
            expect(extractSemver('unknown')).to.be.undefined;
            expect(extractSemver(undefined)).to.be.undefined;
        });
    });

    describe('compareSemver', () => {
        it('compares numerically, not as text', () => {
            expect(compareSemver('6.9.0', 'v6.26.0')).to.be.lessThan(0);
            expect(compareSemver('0.10.21', '0.9.99')).to.be.greaterThan(0);
        });

        it('treats equal versions and missing segments as equal', () => {
            expect(compareSemver('6.26.0', 'v6.26.0')).to.equal(0);
            expect(compareSemver('6.26', '6.26.0')).to.equal(0);
        });

        it('returns undefined if either side has no version', () => {
            expect(compareSemver('dev-build', 'v6.26.0')).to.be.undefined;
            expect(compareSemver('6.26.0', undefined)).to.be.undefined;
        });
    });

    describe('compareBraiinsBuild', () => {
        it('orders by build date', () => {
            expect(
                compareBraiinsBuild('2023-05-29-0-1daef48b-23.03.2-plus', '2026-09-23-0-d6cb014c-26.09.1-plus'),
            ).to.be.lessThan(0);
            expect(
                compareBraiinsBuild('2026-09-23-0-d6cb014c-26.09.1-plus', '2026-09-11-0-7a758742-26.09-plus'),
            ).to.be.greaterThan(0);
        });

        it('orders by release before build date, since Braiins also builds backports of older releases', () => {
            // real S17 builds: 24.04.3, 24.06.2 and 24.08.1 were all built on 2024-09-12
            expect(
                compareBraiinsBuild('2024-09-12-0-9dbf0134-24.04.3-plus', '2024-08-20-0-aaaaaaaa-24.08-plus'),
            ).to.be.lessThan(0);
            expect(
                compareBraiinsBuild('2024-09-12-0-89ae7f26-24.08.1-plus', '2024-09-12-0-4821d892-24.06.2-plus'),
            ).to.be.greaterThan(0);
        });

        it('orders re-spins of the same release by build date', () => {
            // real zynq-bm3-am2 builds: 26.08 was built twice
            expect(
                compareBraiinsBuild('2026-08-04-0-067ad5d4-26.08-plus', '2026-08-12-0-94539d0a-26.08-plus'),
            ).to.be.lessThan(0);
        });

        it('orders re-spins of the same day by their counter, numerically', () => {
            expect(
                compareBraiinsBuild('2026-09-23-2-aaaaaaaa-26.09.1-plus', '2026-09-23-10-bbbbbbbb-26.09.1-plus'),
            ).to.be.lessThan(0);
        });

        it('understands builds without the -plus suffix', () => {
            expect(
                compareBraiinsBuild('2026-09-11-0-ff0d18a2-26.09', '2026-09-23-0-d6cb014c-26.09.1-plus'),
            ).to.be.lessThan(0);
        });

        it('treats the same build as equal', () => {
            const build = '2026-09-23-0-d6cb014c-26.09.1-plus';
            expect(compareBraiinsBuild(build, build)).to.equal(0);
        });

        it('returns undefined for strings that are not build strings', () => {
            expect(compareBraiinsBuild('26.09.1', '2026-09-23-0-d6cb014c-26.09.1-plus')).to.be.undefined;
            expect(compareBraiinsBuild(undefined, '2026-09-23-0-d6cb014c-26.09.1-plus')).to.be.undefined;
        });
    });

    describe('parseAvalonBuild', () => {
        it('reads the build number of the firmware version the miner reports', () => {
            expect(parseAvalonBuild('25021401_56abae7')).to.equal(25021401);
        });

        it('reads the bare build number of the update file', () => {
            expect(parseAvalonBuild('25103101')).to.equal(25103101);
        });

        it('returns undefined for anything else', () => {
            expect(parseAvalonBuild('Nano3s-25021401')).to.be.undefined;
            expect(parseAvalonBuild('')).to.be.undefined;
            expect(parseAvalonBuild(undefined)).to.be.undefined;
        });
    });

    describe('parseIceRiverOcVersion', () => {
        it('reads the version from the package name the miner reports', () => {
            expect(parseIceRiverOcVersion('pbv077c_ks0miner')).to.equal('0.7.7');
            expect(parseIceRiverOcVersion('pbv081_ks5mupdate')).to.equal('0.8.1');
        });

        it('returns undefined for names outside the known scheme', () => {
            expect(parseIceRiverOcVersion('BOOT_2_0.BIN')).to.be.undefined;
            expect(parseIceRiverOcVersion('pbv0810_ks0miner')).to.be.undefined;
            expect(parseIceRiverOcVersion(undefined)).to.be.undefined;
        });
    });
});
