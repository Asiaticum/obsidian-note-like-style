import { Plugin, WorkspaceLeaf, TFile } from 'obsidian';
import { NoteSpacingSettings, DEFAULT_SETTINGS, NoteSpacingSettingTab } from './settings';
import { generateCSS } from './styles';

export default class NoteSpacingPlugin extends Plugin {
    settings: NoteSpacingSettings;
    styleEl: HTMLStyleElement;

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new NoteSpacingSettingTab(this.app, this));

        this.applyStyles();

        this.registerEvent(
            this.app.workspace.on('css-change', () => {
                this.applyStyles();
            })
        );

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                this.updateLeafStyle(leaf);
            })
        );

        this.registerEvent(
            this.app.workspace.on('layout-change', () => {
                this.app.workspace.iterateAllLeaves((leaf) => {
                    this.updateLeafStyle(leaf);
                });
            })
        );

        // Initial check for all leaves
        this.app.workspace.onLayoutReady(() => {
            this.app.workspace.iterateAllLeaves((leaf) => {
                this.updateLeafStyle(leaf);
            });
        });
    }

    onunload() {
        if (this.styleEl) {
            this.styleEl.remove();
        }
        this.app.workspace.iterateAllLeaves((leaf) => {
            if (leaf.view.containerEl) {
                leaf.view.containerEl.removeClass('note-like-style-enabled');
            }
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.applyStyles();
        this.app.workspace.iterateAllLeaves((leaf) => {
            this.updateLeafStyle(leaf);
        });
    }

    applyStyles() {
        if (this.styleEl) {
            this.styleEl.remove();
        }

        this.styleEl = document.createElement('style');
        this.styleEl.id = 'note-spacing-styles';
        this.styleEl.textContent = generateCSS(this.settings);
        document.head.appendChild(this.styleEl);
    }

    updateLeafStyle(leaf: WorkspaceLeaf | null) {
        if (!leaf || !leaf.view) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const file = (leaf.view as any).file;
        const container = leaf.view.containerEl;

        if (!container) return;

        if (this.shouldApplyStyle(file)) {
            container.addClass('note-like-style-enabled');
        } else {
            container.removeClass('note-like-style-enabled');
        }
    }

    shouldApplyStyle(file: TFile | null): boolean {
        if (!this.settings.includedPaths || this.settings.includedPaths.trim() === '') {
            return true; // Apply to all if no paths specified
        }

        if (!file) return false;

        const paths = this.settings.includedPaths.split('\n').map(p => p.trim()).filter(p => p !== '');

        for (const path of paths) {
            if (file.path.startsWith(path)) {
                return true;
            }
        }

        return false;
    }
}
