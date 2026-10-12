# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and GitHub Copilot CLI when working in this repository.

Pushpin is a VS Code extension that pins files and folders from the Explorer context menu into a "Pinned Items" view for quick access. It is published on the Marketplace as `maxs-lab-of-things.pushpin`. The repository is public.

## Commands

```bash
npm run compile      # tsc -p ./ -> out/
npm run watch
npm run package      # vsce package; read the printed file list
npm run publish      # vsce publish
```

Run the extension with F5 from VS Code. There are no tests and no lint script.

## Structure

`src/pinnedItemsProvider.ts` is the tree data provider for the `pushpinView` view and the only owner of state: the pinned list is an array of `PinnedItem` (`src/types.ts`) in `workspaceState` under `pinnedItems`, so pins are per workspace. `src/extension.ts` registers `pushpin.pinItem`, `pushpin.unpinItem`, `pushpin.unpinAll` and `pushpin.openPinnedItem`. The Explorer menu entries are shown or hidden by two context keys set with `setContext`: `pushpin.isPinned`, updated from the active editor in `extension.ts`, and `pushpin.hasPinnedItems`, updated by the provider on every change. A new mutation must refresh the tree and `pushpin.hasPinnedItems`, or the menus go stale. `icons/` holds the SVGs referenced from `package.json`.

`out/` is committed alongside `src/` and so are three old `.vsix` builds. After changing `src/`, run `npm run compile` and commit the regenerated `out/` in the same change so the two never disagree.

## Releasing

`.vscodeignore` is the only control over what ships in the `.vsix`; `.gitignore` is ignored by `vsce`. The managed block in it is rewritten by a standardizing script, so add project-specific exclusions outside that block. The README states the Marketplace version, so bump it with `package.json` and `CHANGELOG.md`. The publishing procedure is in `../README.md`.
