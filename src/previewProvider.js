const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

// TextDocumentContentProvider
// DocumentLinkProvider
exports.previewProvider =
class {

    get onDidChange() { return this._didChange.event; }

    get scheme() { return 'Page'; }

    get index() { return vscode.Uri.parse(`${ this.scheme }://index.html`); }

    constructor(ctx) {
        this._context = ctx;
        this._didChange = new vscode.EventEmitter();
    }

    provideTextDocumentContent(uri) {

        const rr = str => new RegExp(`\\{\\{\\s*${ str }\\s*\\}\\}`, 'gi');

        const p = path.join('file:/', this._context.extensionPath);
        const index = fs.readFileSync( path.join(this._context.extensionPath, 'resources/preview/index.html'), { encoding: 'utf8' });

        return index
            .replace(rr('base'), p.replace(/\\/g, '\\\\'))
            .replace(rr('workspace'), vscode.workspace.workspaceFolders[0].uri.fsPath.replace(/\\/g, '\\\\'))
            .replace(rr('urdf-path'), vscode.window.activeTextEditor.document.fileName)
            .replace(rr('urdf-content'), vscode.window.activeTextEditor.document.getText());

    }

    update() {
        this._didChange.fire(this.index);
    }

}
