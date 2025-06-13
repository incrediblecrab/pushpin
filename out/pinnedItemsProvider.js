"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinnedItemsProvider = void 0;
const vscode = require("vscode");
const fs = require("fs");
const types_1 = require("./types");
class PinnedItemsProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return Promise.resolve(this.getPinnedItems());
        }
        return Promise.resolve([]);
    }
    getPinnedItems() {
        const pinnedItems = this.getAllPinnedItems();
        return pinnedItems
            .filter(item => fs.existsSync(item.path))
            .map(item => new types_1.PinnedItemTreeItem(item, item.type === 'folder'
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None));
    }
    getAllPinnedItems() {
        const pinnedItems = this.context.workspaceState.get('pinnedItems', []);
        return pinnedItems.sort((a, b) => b.timestamp - a.timestamp);
    }
    pinItem(uri) {
        const path = uri.fsPath;
        const stat = fs.statSync(path);
        const type = stat.isDirectory() ? 'folder' : 'file';
        const displayName = require('path').basename(path);
        const pinnedItems = this.getAllPinnedItems();
        if (pinnedItems.some(item => item.path === path)) {
            vscode.window.showInformationMessage(`${displayName} is already pinned`);
            return;
        }
        const newItem = {
            path,
            type,
            timestamp: Date.now(),
            displayName
        };
        pinnedItems.unshift(newItem);
        this.context.workspaceState.update('pinnedItems', pinnedItems);
        this.refresh();
        this.updateContexts();
        vscode.window.showInformationMessage(`Pinned ${displayName}`);
    }
    unpinItem(itemOrUri) {
        const path = 'path' in itemOrUri ? itemOrUri.path : itemOrUri.fsPath;
        const pinnedItems = this.getAllPinnedItems();
        const filteredItems = pinnedItems.filter(item => item.path !== path);
        if (filteredItems.length === pinnedItems.length) {
            vscode.window.showWarningMessage('Item is not pinned');
            return;
        }
        this.context.workspaceState.update('pinnedItems', filteredItems);
        this.refresh();
        this.updateContexts();
        const displayName = require('path').basename(path);
        vscode.window.showInformationMessage(`Unpinned ${displayName}`);
    }
    unpinAll() {
        const pinnedItems = this.getAllPinnedItems();
        if (pinnedItems.length === 0) {
            vscode.window.showInformationMessage('No items to unpin');
            return;
        }
        vscode.window.showWarningMessage(`Unpin all ${pinnedItems.length} items?`, 'Yes', 'No').then(answer => {
            if (answer === 'Yes') {
                this.context.workspaceState.update('pinnedItems', []);
                this.refresh();
                this.updateContexts();
                vscode.window.showInformationMessage('All items unpinned');
            }
        });
    }
    isPinned(uri) {
        const pinnedItems = this.getAllPinnedItems();
        return pinnedItems.some(item => item.path === uri.fsPath);
    }
    updateContexts() {
        const pinnedItems = this.getAllPinnedItems();
        vscode.commands.executeCommand('setContext', 'pushpin.hasPinnedItems', pinnedItems.length > 0);
    }
    openPinnedItem(item) {
        const uri = vscode.Uri.file(item.path);
        if (item.type === 'folder') {
            vscode.commands.executeCommand('revealInExplorer', uri);
        }
        else {
            vscode.window.showTextDocument(uri);
        }
    }
}
exports.PinnedItemsProvider = PinnedItemsProvider;
//# sourceMappingURL=pinnedItemsProvider.js.map