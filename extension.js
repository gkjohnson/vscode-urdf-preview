const vscode = require('vscode');

exports.activate =
function (context) {

    // TODO: must use `vscode.commands.executeCommand('setContext', 'flag', false);` and
    // reference in package.json to ensure the icon only shows up when editing a URDF file
    let disposable = vscode.commands.registerCommand('urdf-viewer.previewURDF', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
exports.deactivate =
function() {}
