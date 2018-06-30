const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const utils = require('./utilities.js');

exports.URDFPreviewProvider =
class {

    get onDidChange() {

        return this._didChange.event;

    }

    get scheme() {

        return 'urdf-preview';

    }

    getUri(file) {

        return vscode.Uri.parse(`${ this.scheme }://authority/` + file);

    }

    constructor(ctx) {

        this._context = ctx;
        this._didChange = new vscode.EventEmitter();

    }

    async provideTextDocumentContent(uri) {

        const filePath = path.join(utils.getWorkspacePath(), uri.fsPath);
        const document = vscode.workspace.textDocuments.find(e => e.fileName.toLowerCase() === filePath.toLowerCase());

        if (document === undefined) {

            return `File "${ path.basename(filePath) }" is closed!`;

        }

        // create the regex for the template replace
        const rr = str => new RegExp(`\\{\\{\\s*${ str }\\s*\\}\\}`, 'gi');

        const extLoadPath = path.join('file:///', this._context.extensionPath);
        const indexHtml =
            fs.readFileSync(
                path.join(this._context.extensionPath, 'resources/preview/index.html'),
                { encoding: 'utf8' }
            );

        const urdfContent = document.getText();
        const files = (await utils.getURDFFileLocations(urdfContent)).map(f => `"${ f.fsPath }"`);

        return indexHtml
            .replace(rr('base'), extLoadPath.replace(/\\/g, '\\\\'))
            .replace(rr('workspace'), utils.getWorkspacePath().replace(/\\/g, '\\\\'))
            .replace(rr('urdf-path'), document.fileName)
            .replace(rr('urdf-content'), urdfContent)
            .replace(rr('files'), `[${ files.join(',') }]`.replace(/\\/g, '\\\\'));

    }

    update(file) {
        this._didChange.fire(this.getUri(file));
    }

}
