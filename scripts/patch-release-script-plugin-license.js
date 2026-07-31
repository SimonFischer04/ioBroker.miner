'use strict';

const fs = require('node:fs');
const path = require('node:path');

const helperCode = String.raw`
const GPL_LICENSE_TEXT_REGEX = /\bGNU\s+(?:AFFERO\s+|LESSER\s+)?GENERAL\s+PUBLIC\s+LICENSE\b/i;
const FREE_SOFTWARE_FOUNDATION_REGEX = /\bFree Software Foundation\b/i;
function getLineContainingMatch(content, match) {
    const lineStart = content.lastIndexOf("\n", match.index) + 1;
    const lineEnd = content.indexOf("\n", match.index + match[0].length);
    return content.slice(lineStart, lineEnd === -1 ? content.length : lineEnd);
}
function isKnownLicenseTextCopyright(content, match) {
    if (!GPL_LICENSE_TEXT_REGEX.test(content))
        return false;
    return FREE_SOFTWARE_FOUNDATION_REGEX.test(getLineContainingMatch(content, match));
}
`;

const helperAnchor = 'import glob from "tiny-glob";\n';
const loopAnchor = 'while ((match = regex.exec(fileContent))) {\n                    if (!latest ||';
const patchedLoop =
    'while ((match = regex.exec(fileContent))) {\n                    if (isKnownLicenseTextCopyright(fileContent, match))\n                        continue;\n                    if (!latest ||';

function main() {
    const packageJsonPath = require.resolve('@alcalzone/release-script-plugin-license/package.json');
    const packageRoot = path.dirname(packageJsonPath);
    const indexPath = path.join(packageRoot, 'build', 'index.js');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    let source = fs.readFileSync(indexPath, 'utf8');

    if (source.includes('isKnownLicenseTextCopyright')) {
        console.log(`release-script license plugin ${packageJson.version} already contains the GPL license text fix.`);
        return;
    }

    const withHelper = source.replace(helperAnchor, `${helperAnchor}${helperCode}`);
    const patched = withHelper.replace(loopAnchor, patchedLoop);

    if (patched === source || !patched.includes('isKnownLicenseTextCopyright')) {
        throw new Error(
            `Could not patch @alcalzone/release-script-plugin-license ${packageJson.version}. ` +
                'Remove scripts/patch-release-script-plugin-license.js after updating to an upstream fixed version.',
        );
    }

    fs.writeFileSync(indexPath, patched);
    console.log(`Patched @alcalzone/release-script-plugin-license ${packageJson.version} GPL license text handling.`);
}

main();
