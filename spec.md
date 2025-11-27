# Note-like Spacing Plugin - 実装要件

## 概要
note.com風の読みやすい行間・段落間スペースをObsidianで実現するプラグイン。
リーディングビューと編集モードで可能な限り同じ見た目を提供する。

## 主要機能

### 1. カスタマイズ可能なパラメータ
プラグイン設定画面から以下のパラメータを変更可能にする：

```typescript
interface NoteSpacingSettings {
  // 行間（line-height）
  lineHeight: number;              // デフォルト: 1.9

  // 段落間のスペース（改行2回の場合）
  paragraphSpacing: number;        // デフォルト: 2.5 (em単位)

  // 見出しの上マージン
  headingTopMargin: number;        // デフォルト: 2.5 (em単位)

  // 見出しの下マージン
  headingBottomMargin: number;     // デフォルト: 1.0 (em単位)

  // テキストカラー
  textColor: string;               // デフォルト: "#222222"

  // フォントファミリー
  fontFamily: string;              // デフォルト: note.com風のフォントスタック

  // 編集モードにも適用するか
  applyToEditMode: boolean;        // デフォルト: true

  // リーディングビューにも適用するか
  applyToReadingMode: boolean;     // デフォルト: true
}
```

### 2. スタイル適用の詳細

#### リーディングビュー（閲覧モード）
```css
/* 段落 */
.markdown-preview-view p {
  line-height: [設定値];
  margin-bottom: [段落間スペース]em;
  margin-top: 0;
  color: [テキストカラー];
}

/* 見出し */
.markdown-preview-view h2,
.markdown-preview-view h3 {
  margin-top: [見出し上マージン]em;
  margin-bottom: [見出し下マージン]em;
  line-height: [設定値];
}

/* 引用ブロック */
.markdown-preview-view blockquote {
  line-height: [設定値];
}

.markdown-preview-view blockquote p {
  line-height: [設定値];
  margin-bottom: [段落間スペース]em;
}

/* フォント */
.markdown-preview-view {
  font-family: [フォントファミリー];
}
```

#### 編集モード
```css
/* 基本の行間 */
.markdown-source-view.mod-cm6 .cm-line {
  line-height: [設定値];
}

/* 空行（段落の区切り）を視覚的に表現 */
.markdown-source-view.mod-cm6 .cm-line:empty {
  display: block;
  height: [段落間スペース]em;
}

/* フォントとカラー */
.markdown-source-view.mod-cm6 .cm-content {
  font-family: [フォントファミリー];
  color: [テキストカラー];
}

/* 見出し */
.markdown-source-view.mod-cm6 .HyperMD-header-2,
.markdown-source-view.mod-cm6 .HyperMD-header-3 {
  margin-top: [見出し上マージン]em;
  margin-bottom: [見出し下マージン]em;
}

/* 引用ブロック */
.markdown-source-view.mod-cm6 .HyperMD-quote {
  line-height: [設定値];
}
```

### 3. 設定UI
- Obsidianの設定画面にプラグイン専用タブを追加
- 各パラメータにスライダーまたは数値入力欄を提供
- リアルタイムプレビュー（設定変更時に即座に反映）
- デフォルト値にリセットするボタン

### 4. 技術的な実装ポイント

#### スタイルの動的適用
```typescript
class NoteSpacingPlugin extends Plugin {
  settings: NoteSpacingSettings;
  styleEl: HTMLStyleElement;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new NoteSpacingSettingTab(this.app, this));
    this.applyStyles();

    // 設定変更時にスタイルを再適用
    this.registerEvent(
      this.app.workspace.on('css-change', () => {
        this.applyStyles();
      })
    );
  }

  applyStyles() {
    // 既存のスタイル要素を削除
    if (this.styleEl) {
      this.styleEl.remove();
    }

    // 新しいスタイルを生成して適用
    this.styleEl = document.createElement('style');
    this.styleEl.id = 'note-spacing-styles';
    this.styleEl.textContent = this.generateCSS();
    document.head.appendChild(this.styleEl);
  }

  generateCSS(): string {
    const s = this.settings;
    let css = '';

    if (s.applyToReadingMode) {
      css += `
        .markdown-preview-view p {
          line-height: ${s.lineHeight} !important;
          margin-bottom: ${s.paragraphSpacing}em !important;
          margin-top: 0 !important;
          color: ${s.textColor} !important;
        }
        .markdown-preview-view {
          font-family: ${s.fontFamily} !important;
        }
        .markdown-preview-view h2,
        .markdown-preview-view h3 {
          margin-top: ${s.headingTopMargin}em !important;
          margin-bottom: ${s.headingBottomMargin}em !important;
          line-height: ${s.lineHeight} !important;
        }
        .markdown-preview-view blockquote {
          line-height: ${s.lineHeight} !important;
        }
        .markdown-preview-view blockquote p {
          line-height: ${s.lineHeight} !important;
          margin-bottom: ${s.paragraphSpacing}em !important;
        }
      `;
    }

    if (s.applyToEditMode) {
      css += `
        .markdown-source-view.mod-cm6 .cm-line {
          line-height: ${s.lineHeight} !important;
        }
        .markdown-source-view.mod-cm6 .cm-line:empty {
          display: block !important;
          height: ${s.paragraphSpacing}em !important;
        }
        .markdown-source-view.mod-cm6 .cm-content {
          font-family: ${s.fontFamily} !important;
          color: ${s.textColor} !important;
        }
        .markdown-source-view.mod-cm6 .HyperMD-header-2,
        .markdown-source-view.mod-cm6 .HyperMD-header-3 {
          margin-top: ${s.headingTopMargin}em !important;
          margin-bottom: ${s.headingBottomMargin}em !important;
        }
        .markdown-source-view.mod-cm6 .HyperMD-quote {
          line-height: ${s.lineHeight} !important;
        }
      `;
    }

    return css;
  }
}
```

#### 設定の永続化
```typescript
const DEFAULT_SETTINGS: NoteSpacingSettings = {
  lineHeight: 1.9,
  paragraphSpacing: 2.5,
  headingTopMargin: 2.5,
  headingBottomMargin: 1.0,
  textColor: '#222222',
  fontFamily: '"Helvetica Neue", "Helvetica", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Arial", "Yu Gothic", "Meiryo", sans-serif',
  applyToEditMode: true,
  applyToReadingMode: true
};

async loadSettings() {
  this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
}

async saveSettings() {
  await this.saveData(this.settings);
  this.applyStyles(); // 設定変更時に即座にスタイルを再適用
}
```

## ファイル構成

```
note-like-spacing/
├── main.ts                 # プラグインのメインロジック
├── settings.ts             # 設定UIの実装
├── styles.ts              # スタイル生成ロジック
├── manifest.json          # プラグインのメタデータ
├── package.json           # npm依存関係
├── tsconfig.json          # TypeScript設定
├── esbuild.config.mjs     # ビルド設定
└── README.md              # 使い方とドキュメント
```

## 開発の優先順位

### Phase 1: 基本機能
1. プラグインの基本構造構築
2. デフォルト設定でのスタイル適用
3. リーディングビューと編集モードの両方に対応

### Phase 2: 設定UI
1. 設定タブの実装
2. パラメータの数値入力/スライダー
3. 設定の保存と読み込み

### Phase 3: 改善
1. リアルタイムプレビュー
2. デフォルト値リセット機能
3. より細かい調整オプションの追加

## 注意点

### 編集モードの制限
- CodeMirror 6の構造上、完全にリーディングビューと同じ見た目にするのは困難
- 空行の高さで段落間スペースを表現するのが現実的
- 折り返し時の行間は `line-height` で制御可能

### パフォーマンス
- スタイルの再適用は軽量な操作だが、頻繁な変更は避ける
- 設定変更時のみスタイルを再生成する

### 互換性
- 他のテーマやCSSスニペットとの競合に注意
- `!important` を使用して優先順位を確保

## テスト項目

1. ✓ リーディングビューで段落間スペースが正しく表示される
2. ✓ 編集モードで段落間スペースが正しく表示される
3. ✓ 設定変更が即座に反映される
4. ✓ プラグインの有効化/無効化が正しく動作する
5. ✓ 設定がObsidianの再起動後も保持される
6. ✓ 見出しのマージンが正しく適用される
7. ✓ フォントとカラーの変更が反映される
8. ✓ 編集モード/リーディングビューの個別ON/OFF動作