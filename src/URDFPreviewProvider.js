const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const utils = require('./utilities.js');

exports.URDFPreviewProvider =
class {

    // getter required by the VSCode interface
    get onDidChange() { return this._didChange.event; }

    // the scheme this text document provider is responsible for
    get scheme() { return 'urdf-preview'; }

    // turns a file path into a URI
    getUri(file) {

        return vscode.Uri.parse(`${ this.scheme }://authority/` + file);

    }

    constructor(ctx) {

        this._context = ctx;
        this._didChange = new vscode.EventEmitter();

    }

    async provideTextDocumentContent(uri) {

        // Find the open file that we're trying to load and display
        // and error if it's not open
        const filePath = path.join(utils.getWorkspacePath(), uri.fsPath);
        const document = vscode.workspace.textDocuments.find(e => e.fileName.toLowerCase() === filePath.toLowerCase());
        if (document === undefined) {

            return `File "${ path.basename(filePath) }" is closed!`;

        }

        // get the locations of the URDF files
        const urdfContent = document.getText();
        const files = (await utils.getURDFFileLocations(urdfContent, filePath)).map(f => `"${ f.fsPath }"`);

        // Fetch the index file and fill out the templat strings
        const extLoadPath = path.join('file:///', this._context.extensionPath);
        const indexHtml =
            fs.readFileSync(
                path.join(this._context.extensionPath, 'resources/preview/index.html'),
                { encoding: 'utf8' }
            );

        // create the regex for the template replace `{{ str }}`
        const rr = str => new RegExp(`\\{\\{\\s*${ str }\\s*\\}\\}`, 'gi');
        return indexHtml
            .replace(rr('base'), extLoadPath.replace(/\\/g, '\\\\'))
            .replace(rr('workspace'), utils.getWorkspacePath().replace(/\\/g, '\\\\'))
            .replace(rr('urdf-content'), urdfContent)
            .replace(rr('files'), `[${ files.join(',') }]`.replace(/\\/g, '\\\\'));

    }

    update(file) {

        this._didChange.fire(this.getUri(file));

    }

};
