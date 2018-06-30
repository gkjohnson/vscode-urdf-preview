const vscode = require('vscode');
const validation = require('./validation.js');

function updateUrdfActive() {
    const name = vscode.window.activeTextEditor.document.fileName;
    vscode.commands.executeCommand('setContext', 'urdfActive', validation.isExtensionURDF(name));
}

exports.activate =
function (context) {

    // Use the URDF schema description to determine whether the file can be visualized
    let disposable = vscode.commands.registerCommand('urdf-viewer.previewURDF', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    vscode.window.onDidChangeActiveTextEditor(updateUrdfActive);
    vscode.workspace.onDidChangeTextDocument(updateUrdfActive);

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
exports.deactivate =
function() {}
