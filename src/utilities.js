const vscode = require('vscode');
const path = require('path');

exports.isExtensionURDF =
function(name) {

    return /\.urdf$/i.test(name);

};

exports.getWorkspacePath =
function() {

    return vscode.workspace.workspaceFolders[0].uri.fsPath;

};

exports.getURDFFileLocations =
async function(content, filePath) {

    const matches = content
        .match(/filename\s*=\s*"[^"]+"/g);

    if (matches == null) return [];

    console.log(filePath)
    const dir = path.dirname(filePath);
    const wsPath = this.getWorkspacePath();
    const patterns = matches
        .map(val => {

            const content = /filename\s*=\s*"([^"]+)"/.exec(val)[1];
            if (/^package:\/\//.test(content)) {
                return content.replace(/^package:\/\//, '**/');
            } else {
                const p = path.resolve(dir, content);
                const relative = path.relative(wsPath, p);
                return relative;
            }

        });

    // TODO: This is a little heavy handed to find every
    // png and jpeg in the file to treat as a texture and isn't
    // resiliant to other external files that might be needed
    // like bin for gltf.
    patterns.push('**/*.jpg', '**/*.jpeg', '**/*.png');

    return vscode.workspace.findFiles(`{${ patterns.join(',') }}`);

};
