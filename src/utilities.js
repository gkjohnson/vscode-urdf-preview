const vscode = require('vscode');

exports.isExtensionURDF =
function(name) {

    return /\.urdf$/i.test(name);

};

exports.getWorkspacePath =
function() {

    return vscode.workspace.workspaceFolders[0].uri.fsPath;

};

exports.getURDFFileLocations =
async function(content) {

    const matches = content
        .match(/package:\/\/[^"]+/g);

    if (matches == null) return [];

    const patterns = matches
        .map(val => val.replace(/^package:\/\//, '**/'))
        .reduce((acc, val) => {

            if (!acc.includes(val)) {

                acc.push(val);

            }

            return acc;

        }, []);

    // TODO: This is a little heavy handed to find every
    // png and jpeg in the file to treat as a texture and isn't
    // resiliant to other external files that might be needed
    // like bin for gltf.
    patterns.push('**/*.jpg', '**/*.jpeg', '**/*.png');

    return vscode.workspace.findFiles(`{${ patterns.join(',') }}`);

};
