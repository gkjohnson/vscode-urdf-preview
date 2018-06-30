const vscode = require('vscode');

exports.isExtensionURDF =
function(name) {

    return /\.urdf$/i.test(name);

}

exports.getWorkspacePath =
function() {

    return vscode.workspace.workspaceFolders[0].uri.fsPath;

}
