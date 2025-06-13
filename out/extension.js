"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const pinnedItemsProvider_1 = require("./pinnedItemsProvider");
function activate(context) {
    const pinnedItemsProvider = new pinnedItemsProvider_1.PinnedItemsProvider(context);
    vscode.window.createTreeView('pushpinView', {
        treeDataProvider: pinnedItemsProvider,
        showCollapseAll: true
    });
    const pinItemCommand = vscode.commands.registerCommand('pushpin.pinItem', (uri) => {
        if (uri) {
            pinnedItemsProvider.pinItem(uri);
        }
    });
    const unpinItemCommand = vscode.commands.registerCommand('pushpin.unpinItem', (item) => {
        if (item && item.pinnedItem) {
            pinnedItemsProvider.unpinItem(item.pinnedItem);
        }
        else if (item && item.fsPath) {
            pinnedItemsProvider.unpinItem(item);
        }
    });
    const unpinAllCommand = vscode.commands.registerCommand('pushpin.unpinAll', () => {
        pinnedItemsProvider.unpinAll();
    });
    const openPinnedItemCommand = vscode.commands.registerCommand('pushpin.openPinnedItem', (item) => {
        pinnedItemsProvider.openPinnedItem(item);
    });
    const updateContextOnExplorerSelection = vscode.window.onDidChangeActiveTextEditor(() => {
        updateContextForActiveFile(pinnedItemsProvider);
    });
    const updateContextOnFileSystemChange = vscode.workspace.onDidSaveTextDocument(() => {
        updateContextForActiveFile(pinnedItemsProvider);
    });
    context.subscriptions.push(pinItemCommand, unpinItemCommand, unpinAllCommand, openPinnedItemCommand, updateContextOnExplorerSelection, updateContextOnFileSystemChange);
    pinnedItemsProvider.updateContexts();
    updateContextForActiveFile(pinnedItemsProvider);
    vscode.window.registerTreeDataProvider('pushpinView', pinnedItemsProvider);
}
exports.activate = activate;
function updateContextForActiveFile(provider) {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const isPinned = provider.isPinned(activeEditor.document.uri);
        vscode.commands.executeCommand('setContext', 'pushpin.isPinned', isPinned);
    }
    else {
        vscode.commands.executeCommand('setContext', 'pushpin.isPinned', false);
    }
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map