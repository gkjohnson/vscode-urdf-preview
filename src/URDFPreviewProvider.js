const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

exports.URDFPreviewProvider =
class {

    get onDidChange() { return this._didChange.event; }

    get scheme() { return 'urdf-preview'; }

    getUri(file) {
        return vscode.Uri.parse(`${ this.scheme }://authority/urdf-preview/` + file);
    }

    constructor(ctx) {
        this._context = ctx;
        this._didChange = new vscode.EventEmitter();
    }

    provideTextDocumentContent(uri) {

        // create the regex for the template replace
        const rr = str => new RegExp(`\\{\\{\\s*${ str }\\s*\\}\\}`, 'gi');

        const extLoadPath = path.join('file:///', this._context.extensionPath);
        const index =
            fs.readFileSync(
                path.join(this._context.extensionPath, 'resources/preview/index.html'),
                { encoding: 'utf8' }
            );


        return index
            .replace(rr('base'), extLoadPath.replace(/\\/g, '\\\\'))
            .replace(rr('workspace'), vscode.workspace.workspaceFolders[0].uri.fsPath.replace(/\\/g, '\\\\'))
            .replace(rr('urdf-path'), vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.fileName)
            .replace(rr('urdf-content'), vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.getText());

    }

    update() {
        this._didChange.fire(this.index);
    }

}
