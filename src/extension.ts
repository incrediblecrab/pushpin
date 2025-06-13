import * as vscode from 'vscode';
import { PinnedItemsProvider } from './pinnedItemsProvider';

export function activate(context: vscode.ExtensionContext) {
    const pinnedItemsProvider = new PinnedItemsProvider(context);
    
    vscode.window.createTreeView('pushpinView', {
        treeDataProvider: pinnedItemsProvider,
        showCollapseAll: true
    });

    const pinItemCommand = vscode.commands.registerCommand('pushpin.pinItem', (uri: vscode.Uri) => {
        if (uri) {
            pinnedItemsProvider.pinItem(uri);
        }
    });

    const unpinItemCommand = vscode.commands.registerCommand('pushpin.unpinItem', (item: any) => {
        if (item && item.pinnedItem) {
            pinnedItemsProvider.unpinItem(item.pinnedItem);
        } else if (item && item.fsPath) {
            pinnedItemsProvider.unpinItem(item);
        }
    });

    const unpinAllCommand = vscode.commands.registerCommand('pushpin.unpinAll', () => {
        pinnedItemsProvider.unpinAll();
    });

    const openPinnedItemCommand = vscode.commands.registerCommand('pushpin.openPinnedItem', (item: any) => {
        pinnedItemsProvider.openPinnedItem(item);
    });

    const updateContextOnExplorerSelection = vscode.window.onDidChangeActiveTextEditor(() => {
        updateContextForActiveFile(pinnedItemsProvider);
    });

    const updateContextOnFileSystemChange = vscode.workspace.onDidSaveTextDocument(() => {
        updateContextForActiveFile(pinnedItemsProvider);
    });

    context.subscriptions.push(
        pinItemCommand,
        unpinItemCommand,
        unpinAllCommand,
        openPinnedItemCommand,
        updateContextOnExplorerSelection,
        updateContextOnFileSystemChange
    );

    pinnedItemsProvider.updateContexts();
    updateContextForActiveFile(pinnedItemsProvider);

    vscode.window.registerTreeDataProvider('pushpinView', pinnedItemsProvider);
}

function updateContextForActiveFile(provider: PinnedItemsProvider) {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const isPinned = provider.isPinned(activeEditor.document.uri);
        vscode.commands.executeCommand('setContext', 'pushpin.isPinned', isPinned);
    } else {
        vscode.commands.executeCommand('setContext', 'pushpin.isPinned', false);
    }
}

export function deactivate() {}