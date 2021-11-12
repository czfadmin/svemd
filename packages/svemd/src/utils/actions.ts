import { EditorView } from '@codemirror/view'
import { ChangeSpec, TransactionSpec } from '@codemirror/state'
import { ISvemdAction, ISvemdActionContext } from './../types/actions'

function wrapText(editor: EditorView, level: number) {
    const state = editor.state
    const selection = state.selection
    let startIdx = -1
    let endIdx = -1
    let changeSpec: ChangeSpec
    startIdx = selection.ranges[0].from
    endIdx = selection.ranges[0].to
    let insertMark = ''
    for (let i = 0; i < level; i++) {
        insertMark = `${insertMark}#`
    }
    changeSpec = {
        from: startIdx,
        to: startIdx,
        insert: `${insertMark} `,
    }
    editor.dispatch({
        changes: changeSpec,
    })
}

function wrapTextWithBold(editor: EditorView, type: 'Bold' | 'Italic') {
    let mark
    if (type === 'Bold') {
        mark = '**'
    } else if (type === 'Italic') {
        mark = '--'
    }
    const selection = editor.state.selection
    let from = selection.ranges[0].from
    let to = selection.ranges[0].to
    let spec: TransactionSpec
    console.log(selection.ranges)
    if (selection) {
        const oldText = editor.state.doc.sliceString(from, to)
        if (/^\*\*(.*?)\*\*$/.test(oldText.trim())) {
            spec = editor.state.replaceSelection(
                oldText.trim().replace(/^\*\*(.*?)\*\*$/, '$1')
            )
        } else {
            spec = editor.state.replaceSelection(`${mark}${oldText}${mark}`)
        }

        editor.dispatch(spec)

    }
}

export const defaultActions: ISvemdAction[] = [
    {
        type: 'svemd-action-open-url',
        label: 'Open URL',
        action: (context: ISvemdActionContext) => {},
    },
    {
        type: 'svemd-action-h1',
        label: 'H1',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, 1)
        },
    },
    {
        type: 'svemd-action-h2',
        label: 'H2',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, 2)
        },
    },
    {
        type: 'svemd-action-h3',
        label: 'H3',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, 3)
        },
    },
    {
        type: 'svemd-action-h4',
        label: 'h4',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, 4)
        },
    },
    {
        type: 'svemd-action-h5',
        label: 'h5',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, 5)
        },
    },
    {
        type: 'svemd-action-h6',
        label: 'h6',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, 6)
        },
    },
    {
        type: 'svemd-action-bold',
        label: 'B',
        action: (context: ISvemdActionContext) => {
            wrapTextWithBold(context.editor, 'Bold')
        },
    },
    {
        type: 'svemd-action-Italic',
        label: 'I',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, 6)
        },
    },
]
