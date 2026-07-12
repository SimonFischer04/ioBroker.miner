import { expect } from 'chai';
import { buildBosMinerBackupConfigCommand, patchBosMinerPowerTargetConfig } from '../miner/BOSMiner';
describe('BOSMiner', () => {
    // TODO: use actual toml files for test?
    describe('patchBosMinerPowerTargetConfig', () => {
        it('should bump timestamp', () => {
            const config = `
[format]
version = "2.0"
timestamp = 1000 # previous write
[autotuning]
enabled = true
mode = 'power_target'
power_target = 1200 # current target
`;
            const patched = patchBosMinerPowerTargetConfig(config, 1500, 1_700_000_000);
            expect(patched).to.equal(`
[format]
version = "2.0"
timestamp = 1700000000 # previous write
[autotuning]
enabled = true
mode = 'power_target'
power_target = 1500 # current target
`);
        });
        it('should format clean file properly', () => {
            const config = '';
            let patched = patchBosMinerPowerTargetConfig(config, 1400, 1_700_000_001);
            expect(patched).to.equal(
                `\n\n[format]\ntimestamp = 1700000001\n\n[autotuning]\nenabled = true\nmode = 'power_target'\npower_target = 1400\n`,
            );
            patched = patchBosMinerPowerTargetConfig(config, 1300, 1_700_000_002);
            expect(patched).to.equal(
                `\n\n[format]\ntimestamp = 1700000002\n\n[autotuning]\nenabled = true\nmode = 'power_target'\npower_target = 1300\n`,
            );
        });
        it('should format broken heredoc file properly', () => {
            const config = `[format]
timestamp = 1700000000
[autotuning]
        enabled = false`;
            const patched = patchBosMinerPowerTargetConfig(config, 200, 1_700_000_003);
            expect(patched).to.equal(
                `[format]\ntimestamp = 1700000003\n[autotuning]\n        enabled = true\nmode = 'power_target'\npower_target = 200\n`,
            );
        });
    });
    describe('buildBosMinerBackupConfigCommand', () => {
        it('only creates the backup when it does not exist yet', () => {
            const command = buildBosMinerBackupConfigCommand();
            expect(command).to.equal(
                "test -f '/etc/bosminer.toml.iobroker-power-target.bak' || cp '/etc/bosminer.toml' '/etc/bosminer.toml.iobroker-power-target.bak'",
            );
        });
    });
});
