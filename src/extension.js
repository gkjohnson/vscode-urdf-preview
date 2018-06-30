const vscode = require('vscode');
const validation = require('./validation.js');
const previewProvider = require('./previewProvider.js').previewProvider;


function updateUrdfActive() {
    if (!vscode.window.activeTextEditor) {
        vscode.commands.executeCommand('setContext', 'urdfActive', false);
    } else {
        const name = vscode.window.activeTextEditor.document.fileName;
        vscode.commands.executeCommand('setContext', 'urdfActive', validation.isExtensionURDF(name));
    }
}

exports.activate =
function (context) {
    const pp = new previewProvider(context);
    context.subscriptions.push(
        vscode.workspace.registerTextDocumentContentProvider(pp.scheme, pp),

        // Use the URDF schema description to determine whether the file can be visualized
        vscode.commands.registerCommand('urdf-viewer.previewURDF', function () {
            const fileName = vscode.window.activeTextEditor.document.fileName.split(/\\|\//g).pop();
            let col = vscode.window.activeTextEditor.viewColumn;
            col = col >= 3 ? 2 : col + 1;

            vscode.commands.executeCommand('vscode.previewHtml', pp.index, col, `URDF-Preview ( ${ fileName } )`);

            pp.update();
        }),

        vscode.window.onDidChangeActiveTextEditor(updateUrdfActive),
        vscode.workspace.onDidChangeTextDocument(updateUrdfActive),
        vscode.workspace.onDidChangeTextDocument(() => pp.update())
    );
}

// this method is called when your extension is deactivated
exports.deactivate =
function() {}
