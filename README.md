# pushpin

![Version](https://img.shields.io/visual-studio-marketplace/v/maxs-lab-of-things.pushpin) ![MLoT](https://img.shields.io/badge/MLoT-ai-blue)

Pushpin is a VS Code extension that adds a "Pinned Items" Explorer view for quick access to selected files and folders. It is published on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=maxs-lab-of-things.pushpin) as `maxs-lab-of-things.pushpin`; the published version is 1.5.1, matching this repository.

![Demo](https://raw.githubusercontent.com/incrediblecrab/mlot-developer-media/main/gifs/pushpin.gif)

**Objective:** keep frequently used workspace paths visible without moving files, changing imports or writing project metadata.

**Inputs:** VS Code 1.74.0 or later. Pinned paths are stored in VS Code workspace state and are shown only while the underlying file or folder still exists.

**Files:**

- [`src/`](src/): the TypeScript extension source, pinned items tree provider and types
- [`out/`](out/): compiled JavaScript used by the extension entry point
- [`icons/`](icons/): SVG icons for pin, unpin and clear actions
- [`package.json`](package.json): extension metadata, commands, view contributions and npm scripts
- [`CHANGELOG.md`](CHANGELOG.md): release history
- [`icon.png`](icon.png): Marketplace icon
- [`tsconfig.json`](tsconfig.json): TypeScript compiler settings

**Try it:** install the published build with `ext install maxs-lab-of-things.pushpin`. For local development, run `npm install`, then `npm run compile`, and launch the extension host from VS Code.

## Usage

Right-click a file or folder in the VS Code Explorer and select "Pin This". The item appears in the "Pinned Items" view, sorted newest first.

Click a pinned file to open it. Click a pinned folder to reveal it in the Explorer. Use "Remove Pin" on an individual item or "Clear All Pins" from the Explorer context menu or Pinned Items view title to remove pins.

Pinning is visual only. The extension stores paths in VS Code workspace state, filters out paths that no longer exist and does not modify the workspace file tree.

## Commands

| Command | Title | Where it appears |
| --- | --- | --- |
| `pushpin.pinItem` | Pin This | Explorer context menu when the current item is not pinned |
| `pushpin.unpinItem` | Remove Pin | Explorer context menu for pinned items and Pinned Items inline menu |
| `pushpin.unpinAll` | Clear All Pins | Explorer context menu when pins exist and Pinned Items view title |
| `pushpin.openPinnedItem` | Open | Pinned item click action |

## Settings

Pushpin does not contribute VS Code settings.

## Development

- `npm run compile`: compile TypeScript with `tsc -p ./`
- `npm run watch`: compile in watch mode
- `npm run package`: create a VSIX with `vsce package`
- `npm run publish`: publish with `vsce publish`

Do not publish from this repository unless the package metadata and Marketplace release are intentionally being updated.

## Links

- [Marketplace listing](https://marketplace.visualstudio.com/items?itemName=maxs-lab-of-things.pushpin)
- [Demo video](https://youtu.be/LwNM0DSFKFU)
- [MLoT product page](https://mlot.ai/pushpin/)
- [Privacy policy](https://mlot.ai/privacy/)
- Publisher: [Max's Lab of Things](https://mlot.ai/)

## License

MIT. See [`LICENSE`](LICENSE).
