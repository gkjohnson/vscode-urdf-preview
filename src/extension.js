const vscode = require('vscode');
const path = require('path');
const validation = require('./validation.js');
const URDFPreviewProvider = require('./URDFPreviewProvider').URDFPreviewProvider;

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
    const pp = new URDFPreviewProvider(context);
    context.subscriptions.push(
        vscode.workspace.registerTextDocumentContentProvider(pp.scheme, pp),

        // Use the URDF schema description to determine whether the file can be visualized
        vscode.commands.registerCommand('urdf-viewer.previewURDF', function () {
            const fileName = path.basename(vscode.window.activeTextEditor.document.fileName);
            let col = vscode.window.activeTextEditor.viewColumn;
            col = col >= 3 ? 2 : col + 1;

            return vscode.commands.executeCommand('vscode.previewHtml', pp.getUri(), col, `URDF-Preview ( ${ fileName } )`);

        }),

        vscode.window.onDidChangeActiveTextEditor(updateUrdfActive),
        vscode.workspace.onDidChangeTextDocument(updateUrdfActive),
        vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document === vscode.window.activeTextEditor.document) {
                pp.update()
            }
        })
    );

    // Show the icon if we can on first activate instead of waiting
    // until one of the editors changes
    updateUrdfActive();
}

// this method is called when your extension is deactivated
exports.deactivate =
function() {}
