import { App, PluginSettingTab, Setting } from 'obsidian';
import NoteSpacingPlugin from './main';

export interface NoteSpacingSettings {
    lineHeight: number;
    paragraphSpacing: number;
    headingTopMargin: number;
    headingBottomMargin: number;
    textColor: string;
    fontFamily: string;
    applyToEditMode: boolean;
    applyToReadingMode: boolean;
    includedPaths: string;
    language: 'ja' | 'en';
}

export const DEFAULT_SETTINGS: NoteSpacingSettings = {
    lineHeight: 2.05,
    paragraphSpacing: 2.15,
    headingTopMargin: 0.85,
    headingBottomMargin: 0.3,
    textColor: '#222222',
    fontFamily: '"Helvetica Neue", "Helvetica", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Arial", "Yu Gothic", "Meiryo", "sans-serif"',
    applyToEditMode: true,
    applyToReadingMode: true,
    includedPaths: '',
    language: 'ja'
}

const TEXTS = {
    ja: {
        settingsTitle: 'Note-like Style 設定',
        language: '言語 (Language)',
        languageDesc: '設定画面の表示言語を選択します。',
        lineHeight: '行間 (Line Height)',
        lineHeightDesc: 'テキストの行の高さです。',
        paragraphSpacing: '段落間スペース (em)',
        paragraphSpacingDesc: '段落間のスペースの大きさです。',
        headingTopMargin: '見出しの上マージン (em)',
        headingTopMarginDesc: '見出しの上のスペースです。',
        headingBottomMargin: '見出しの下マージン (em)',
        headingBottomMarginDesc: '見出しの下のスペースです。',
        textColor: 'テキストカラー',
        textColorDesc: 'テキストの色を指定します。',
        fontFamily: 'フォントファミリー',
        fontFamilyDesc: '使用するフォントファミリーを指定します。',
        includedPaths: '適用範囲 (パス)',
        includedPathsDesc: 'スタイルを適用するファイルまたはフォルダのパスを改行区切りで指定します。空欄の場合は全てのファイルに適用されます。',
        applyToEditMode: '編集モードに適用',
        applyToEditModeDesc: '編集モード (Live Preview) にスタイルを適用します。',
        applyToReadingMode: '閲覧モードに適用',
        applyToReadingModeDesc: '閲覧モード (Reading View) にスタイルを適用します。',
        resetDefaults: 'デフォルトに戻す'
    },
    en: {
        settingsTitle: 'Note-like Style Settings',
        language: 'Language',
        languageDesc: 'Select the display language for settings.',
        lineHeight: 'Line Height',
        lineHeightDesc: 'Line height for text.',
        paragraphSpacing: 'Paragraph Spacing (em)',
        paragraphSpacingDesc: 'Spacing between paragraphs.',
        headingTopMargin: 'Heading Top Margin (em)',
        headingTopMarginDesc: 'Margin above headings.',
        headingBottomMargin: 'Heading Bottom Margin (em)',
        headingBottomMarginDesc: 'Margin below headings.',
        textColor: 'Text Color',
        textColorDesc: 'Color of the text.',
        fontFamily: 'Font Family',
        fontFamilyDesc: 'Font family to use.',
        includedPaths: 'Included Paths',
        includedPathsDesc: 'Specify file or folder paths to apply styles to, separated by newlines. If empty, applies to all files.',
        applyToEditMode: 'Apply to Edit Mode',
        applyToEditModeDesc: 'Apply styles to Editing mode (Live Preview).',
        applyToReadingMode: 'Apply to Reading Mode',
        applyToReadingModeDesc: 'Apply styles to Reading mode (Reading View).',
        resetDefaults: 'Reset to Defaults'
    }
};

export class NoteSpacingSettingTab extends PluginSettingTab {
    plugin: NoteSpacingPlugin;

    constructor(app: App, plugin: NoteSpacingPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        const t = TEXTS[this.plugin.settings.language];

        containerEl.empty();

        containerEl.createEl('h2', { text: t.settingsTitle });

        new Setting(containerEl)
            .setName(t.language)
            .setDesc(t.languageDesc)
            .addDropdown(dropdown => dropdown
                .addOption('ja', '日本語')
                .addOption('en', 'English')
                .setValue(this.plugin.settings.language)
                .onChange(async (value: 'ja' | 'en') => {
                    this.plugin.settings.language = value;
                    await this.plugin.saveSettings();
                    this.display(); // Refresh to show new language
                }));

        new Setting(containerEl)
            .setName(t.lineHeight)
            .setDesc(t.lineHeightDesc)
            .addText(text => text
                .setPlaceholder('1.9')
                .setValue(String(this.plugin.settings.lineHeight))
                .onChange(async (value) => {
                    const num = parseFloat(value);
                    if (!isNaN(num)) {
                        this.plugin.settings.lineHeight = num;
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(containerEl)
            .setName(t.paragraphSpacing)
            .setDesc(t.paragraphSpacingDesc)
            .addText(text => text
                .setPlaceholder('2.5')
                .setValue(String(this.plugin.settings.paragraphSpacing))
                .onChange(async (value) => {
                    const num = parseFloat(value);
                    if (!isNaN(num)) {
                        this.plugin.settings.paragraphSpacing = num;
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(containerEl)
            .setName(t.headingTopMargin)
            .setDesc(t.headingTopMarginDesc)
            .addText(text => text
                .setPlaceholder('2.5')
                .setValue(String(this.plugin.settings.headingTopMargin))
                .onChange(async (value) => {
                    const num = parseFloat(value);
                    if (!isNaN(num)) {
                        this.plugin.settings.headingTopMargin = num;
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(containerEl)
            .setName(t.headingBottomMargin)
            .setDesc(t.headingBottomMarginDesc)
            .addText(text => text
                .setPlaceholder('1.0')
                .setValue(String(this.plugin.settings.headingBottomMargin))
                .onChange(async (value) => {
                    const num = parseFloat(value);
                    if (!isNaN(num)) {
                        this.plugin.settings.headingBottomMargin = num;
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(containerEl)
            .setName(t.textColor)
            .setDesc(t.textColorDesc)
            .addText(text => text
                .setPlaceholder('#222222')
                .setValue(this.plugin.settings.textColor)
                .onChange(async (value) => {
                    this.plugin.settings.textColor = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t.fontFamily)
            .setDesc(t.fontFamilyDesc)
            .addTextArea(text => text
                .setPlaceholder('Font Family')
                .setValue(this.plugin.settings.fontFamily)
                .onChange(async (value) => {
                    this.plugin.settings.fontFamily = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t.includedPaths)
            .setDesc(t.includedPathsDesc)
            .addTextArea(text => text
                .setPlaceholder('Example/Folder\nExample Note.md')
                .setValue(this.plugin.settings.includedPaths)
                .onChange(async (value) => {
                    this.plugin.settings.includedPaths = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t.applyToEditMode)
            .setDesc(t.applyToEditModeDesc)
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.applyToEditMode)
                .onChange(async (value) => {
                    this.plugin.settings.applyToEditMode = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t.applyToReadingMode)
            .setDesc(t.applyToReadingModeDesc)
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.applyToReadingMode)
                .onChange(async (value) => {
                    this.plugin.settings.applyToReadingMode = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .addButton(button => button
                .setButtonText(t.resetDefaults)
                .onClick(async () => {
                    this.plugin.settings = Object.assign({}, DEFAULT_SETTINGS);
                    await this.plugin.saveSettings();
                    this.display();
                }));
    }
}
