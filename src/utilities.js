const vscode = require('vscode');

exports.isExtensionURDF =
function(name) {

    return /\.urdf$/i.test(name);

}

exports.getWorkspacePath =
function() {

    return vscode.workspace.workspaceFolders[0].uri.fsPath;

}

exports.getURDFFileLocations =
async function(content) {

    const patterns = content
        .match(/package:\/\/[^"]+/g)
        .map(val => val.replace(/^package:\/\//, '**/'))
        .reduce((acc, val) => {

            if (!acc.includes(val)) {
                acc.push(val);
            }

            return acc
        }, [])

    patterns.push('**/*.jpg', '**/*.jpeg', '**/*.png')

    return await vscode.workspace.findFiles(`{${ patterns.join(',') }}`)
}
