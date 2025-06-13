"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinnedItemTreeItem = void 0;
const vscode = require("vscode");
class PinnedItemTreeItem extends vscode.TreeItem {
    constructor(pinnedItem, collapsibleState) {
        super(pinnedItem.displayName, collapsibleState);
        this.pinnedItem = pinnedItem;
        this.collapsibleState = collapsibleState;
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
    getRelativePath(fullPath) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(fullPath));
        if (workspaceFolder) {
            return vscode.workspace.asRelativePath(fullPath);
        }
        return fullPath;
    }
}
exports.PinnedItemTreeItem = PinnedItemTreeItem;
//# sourceMappingURL=types.js.map