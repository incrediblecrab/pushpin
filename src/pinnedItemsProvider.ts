import * as vscode from 'vscode';
import * as fs from 'fs';
import { PinnedItem, PinnedItemTreeItem } from './types';

export class PinnedItemsProvider implements vscode.TreeDataProvider<PinnedItemTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<PinnedItemTreeItem | undefined | null | void> = new vscode.EventEmitter<PinnedItemTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<PinnedItemTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: PinnedItemTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: PinnedItemTreeItem): Thenable<PinnedItemTreeItem[]> {
        if (!element) {
            return Promise.resolve(this.getPinnedItems());
        }
        return Promise.resolve([]);
    }

    private getPinnedItems(): PinnedItemTreeItem[] {
        const pinnedItems = this.getAllPinnedItems();
        return pinnedItems
            .filter(item => fs.existsSync(item.path))
            .map(item => new PinnedItemTreeItem(
                item,
                item.type === 'folder' 
                    ? vscode.TreeItemCollapsibleState.Collapsed 
                    : vscode.TreeItemCollapsibleState.None
            ));
    }

    getAllPinnedItems(): PinnedItem[] {
        const pinnedItems = this.context.workspaceState.get<PinnedItem[]>('pinnedItems', []);
        return pinnedItems.sort((a, b) => b.timestamp - a.timestamp);
    }

    pinItem(uri: vscode.Uri): void {
        const path = uri.fsPath;
        const stat = fs.statSync(path);
        const type = stat.isDirectory() ? 'folder' : 'file';
        const displayName = require('path').basename(path);

        const pinnedItems = this.getAllPinnedItems();
        
        if (pinnedItems.some(item => item.path === path)) {
            vscode.window.showInformationMessage(`${displayName} is already pinned`);
            return;
        }

        const newItem: PinnedItem = {
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

    unpinItem(itemOrUri: PinnedItem | vscode.Uri): void {
        const path = 'path' in itemOrUri ? itemOrUri.path : (itemOrUri as vscode.Uri).fsPath;
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

    unpinAll(): void {
        const pinnedItems = this.getAllPinnedItems();
        if (pinnedItems.length === 0) {
            vscode.window.showInformationMessage('No items to unpin');
            return;
        }

        vscode.window.showWarningMessage(
            `Unpin all ${pinnedItems.length} items?`,
            'Yes', 'No'
        ).then(answer => {
            if (answer === 'Yes') {
                this.context.workspaceState.update('pinnedItems', []);
                this.refresh();
                this.updateContexts();
                vscode.window.showInformationMessage('All items unpinned');
            }
        });
    }

    isPinned(uri: vscode.Uri): boolean {
        const pinnedItems = this.getAllPinnedItems();
        return pinnedItems.some(item => item.path === uri.fsPath);
    }

    updateContexts(): void {
        const pinnedItems = this.getAllPinnedItems();
        vscode.commands.executeCommand('setContext', 'pushpin.hasPinnedItems', pinnedItems.length > 0);
    }

    openPinnedItem(item: PinnedItem): void {
        const uri = vscode.Uri.file(item.path);
        
        if (item.type === 'folder') {
            vscode.commands.executeCommand('revealInExplorer', uri);
        } else {
            vscode.window.showTextDocument(uri);
        }
    }
}