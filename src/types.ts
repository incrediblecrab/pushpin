import * as vscode from 'vscode';

export interface PinnedItem {
    path: string;
    type: 'file' | 'folder';
    timestamp: number;
    displayName: string;
}

export class PinnedItemTreeItem extends vscode.TreeItem {
    constructor(
        public readonly pinnedItem: PinnedItem,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(pinnedItem.displayName, collapsibleState);
        
        this.tooltip = pinnedItem.path;
        this.description = this.getRelativePath(pinnedItem.path);
        this.resourceUri = vscode.Uri.file(pinnedItem.path);
        
        this.contextValue = 'pinnedItem';
        this.iconPath = pinnedItem.type === 'folder' 
            ? new vscode.ThemeIcon('folder')
            : vscode.ThemeIcon.File;
            
        this.command = {
            command: 'pushpin.openPinnedItem',
            title: 'Open',
            arguments: [pinnedItem]
        };
    }

    private getRelativePath(fullPath: string): string {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(fullPath));
        if (workspaceFolder) {
            return vscode.workspace.asRelativePath(fullPath);
        }
        return fullPath;
    }
}