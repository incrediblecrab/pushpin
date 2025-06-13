# Pushpin - VS Code Extension

## Project Overview
A VS Code extension that allows users to pin files and folders for quick access. Provides a dedicated tree view in the Explorer for managing pinned items with bookmark-like functionality.

## Technology Stack
- TypeScript
- VS Code Extension API
- Tree Data Provider
- Context menu integration
- SVG icons

## Architecture
- `src/extension.ts` - Main extension entry point and command registration
- `src/pinnedItemsProvider.ts` - Tree view provider for managing pinned items
- `src/types.ts` - Type definitions for pinned items and data structures
- `icons/` - SVG icons for pin, unpin, and trash operations

## Key Features
- Pin/unpin files and folders from Explorer context menu
- Dedicated "Pinned Items" view in Explorer
- Persistent storage of pinned items
- Quick access to frequently used files/folders
- Bulk operations (clear all pins)
- Context-aware menu items

## Development Commands
- `npm run compile` - Compile TypeScript
- `npm run watch` - Watch for changes and recompile
- `npm run package` - Package extension as .vsix
- `npm run publish` - Publish to VS Code marketplace

## User Interface
The extension adds:
- "Pinned Items" tree view in VS Code Explorer
- Context menu items in Explorer (Pin This/Remove Pin/Clear All Pins)
- Inline buttons for unpinning items
- Welcome message when no items are pinned

## Commands
- `pushpin.pinItem` - Pin selected file or folder
- `pushpin.unpinItem` - Remove pin from selected item
- `pushpin.unpinAll` - Clear all pinned items
- `pushpin.openPinnedItem` - Open a pinned item

## Context Menu Integration
The extension dynamically shows/hides context menu items based on:
- `pushpin.isPinned` - Whether current item is already pinned
- `pushpin.hasPinnedItems` - Whether any items are pinned

## Usage
1. Right-click on any file or folder in VS Code Explorer
2. Select "Pin This" to add it to your pinned items
3. Access pinned items from the "Pinned Items" view
4. Use "Remove Pin" or "Clear All Pins" to manage your pins