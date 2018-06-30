const vscode = require('vscode');
const validation = require('./validation.js');
const previewProvider = require('./previewProvider.js').previewProvider;


function updateUrdfActive() {
    const name = vscode.window.activeTextEditor.document.fileName;
    vscode.commands.executeCommand('setContext', 'urdfActive', validation.isExtensionURDF(name));
}

exports.activate =
function (context) {
    const pp = new previewProvider(context);
    pp.schemes.forEach(s => {
        vscode.workspace.registerTextDocumentContentProvider(s, pp);
    });

    // Use the URDF schema description to determine whether the file can be visualized
    const disposable = vscode.commands.registerCommand('urdf-viewer.previewURDF', function () {
        const fileName = vscode.window.activeTextEditor.document.fileName.split(/\\|\//g).pop();
        vscode.commands.executeCommand('vscode.previewHtml', pp.index, vscode.ViewColumn.Two, `URDF-Preview ( ${ fileName } )`);
    });

    vscode.window.onDidChangeActiveTextEditor(updateUrdfActive);
    vscode.workspace.onDidChangeTextDocument(updateUrdfActive);

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
exports.deactivate =
function() {}
