import { NoteSpacingSettings } from './settings';

export function generateCSS(s: NoteSpacingSettings): string {
    let css = '';

    if (s.applyToReadingMode) {
        css += `
        .note-like-style-enabled .markdown-preview-view p {
            line-height: ${s.lineHeight} !important;
            margin-bottom: ${s.paragraphSpacing}em !important;
            margin-top: 0 !important;
            color: ${s.textColor} !important;
        }
        .note-like-style-enabled .markdown-preview-view {
            font-family: ${s.fontFamily} !important;
        }
        .note-like-style-enabled .markdown-preview-view h2,
        .note-like-style-enabled .markdown-preview-view h3 {
            margin-top: ${s.headingTopMargin}em !important;
            margin-bottom: ${s.headingBottomMargin}em !important;
            line-height: ${s.lineHeight} !important;
        }
        .note-like-style-enabled .markdown-preview-view blockquote {
            line-height: ${s.lineHeight} !important;
        }
        .note-like-style-enabled .markdown-preview-view blockquote p {
            line-height: ${s.lineHeight} !important;
            margin-bottom: ${s.paragraphSpacing}em !important;
        }
        `;
    }

    if (s.applyToEditMode) {
        css += `
        .note-like-style-enabled .markdown-source-view.mod-cm6 .cm-line {
            line-height: ${s.lineHeight} !important;
        }
        .note-like-style-enabled .markdown-source-view.mod-cm6 .cm-line:has(br) {
            display: block !important;
            height: ${s.paragraphSpacing}em !important;
        }
        /* Ensure we don't affect lines with actual content that might have a br for some reason,
           though usually br is only sole child in empty lines.
           Better selector: .cm-line:not(.HyperMD-header):not(.HyperMD-quote):has(> br:only-child)
        */
        .note-like-style-enabled .markdown-source-view.mod-cm6 .cm-line:not(.HyperMD-header):not(.HyperMD-quote):has(> br:only-child) {
            display: block !important;
            height: ${s.paragraphSpacing}em !important;
        }
        .note-like-style-enabled .markdown-source-view.mod-cm6 .cm-content {
            font-family: ${s.fontFamily} !important;
            color: ${s.textColor} !important;
        }
        .note-like-style-enabled .markdown-source-view.mod-cm6 .HyperMD-header-2,
        .note-like-style-enabled .markdown-source-view.mod-cm6 .HyperMD-header-3 {
            margin-top: ${s.headingTopMargin}em !important;
            margin-bottom: ${s.headingBottomMargin}em !important;
        }
        .note-like-style-enabled .markdown-source-view.mod-cm6 .HyperMD-quote {
            line-height: ${s.lineHeight} !important;
        }
        `;
    }

    return css;
}
