const fs = require('node:fs/promises');
const path = require('node:path');

/**
 * Ensures the given path exists and is a directory.
 *
 * @param {string} dirPath Path to validate.
 * @returns {Promise<void>}
 */
async function assertDirectory(dirPath) {
    const stats = await fs.stat(dirPath);
    if (!stats.isDirectory()) {
        throw new Error(`Expected directory but got file: ${dirPath}`);
    }
}

/**
 * Copies all entries from one directory into another directory.
 *
 * @param {string} sourceDir Directory to copy entries from.
 * @param {string} targetDir Directory to copy entries to.
 * @returns {Promise<void>}
 */
async function copyDirectoryContents(sourceDir, targetDir) {
    await assertDirectory(sourceDir);
    await fs.mkdir(targetDir, { recursive: true });

    const entries = await fs.readdir(sourceDir, { withFileTypes: true });
    for (const entry of entries) {
        const sourcePath = path.join(sourceDir, entry.name);
        const targetPath = path.join(targetDir, entry.name);
        await fs.cp(sourcePath, targetPath, { recursive: true, force: true });
    }
}

/**
 * Executes the postbuild copy steps in a cross-platform way.
 *
 * @returns {Promise<void>}
 */
async function main() {
    const rootDir = path.resolve(__dirname, '..');

    await copyDirectoryContents(path.join(rootDir, 'src', 'lib', 'i18n'), path.join(rootDir, 'build', 'lib', 'i18n'));

    await copyDirectoryContents(
        path.join(rootDir, 'src', 'lib', 'generated', 'bos-api', 'proto'),
        path.join(rootDir, 'build', 'lib', 'generated', 'bos-api', 'proto'),
    );
}

main().catch(error => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`postbuild failed: ${message}`);
    process.exitCode = 1;
});
