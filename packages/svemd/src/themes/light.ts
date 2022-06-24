import { EditorView } from '@codemirror/view'
const lightTheme = EditorView.theme(
    {
        '&': { height: '300px' },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-content, .cm-gutter': { minHeight: '200px' },
        '&.cm-focused': {
            outline: 'none!important',
            borderRadius: '2px',
        },
    },
    {
        dark: false,
    }
)

export default lightTheme
