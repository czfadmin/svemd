import { EditorView } from '@codemirror/view'
import { ChangeSpec, SelectionRange, TransactionSpec } from '@codemirror/state'
import { ISvemdAction, ISvemdActionContext } from '../types'
import { icons } from '../icons'

function wrapText(editor: EditorView, before: string, after: string = '') {
    const state = editor.state
    const selection = state.selection
    let startIdx = -1
    let endIdx = -1
    let changeSpec: ChangeSpec
    startIdx = selection.ranges[0].from
    endIdx = selection.ranges[0].to
    let doc = editor.state.doc.sliceString(startIdx, endIdx)
    let insertText = ``
    if (after.length > 0) {
        insertText = `${before}${doc}${after}`
    } else {
        insertText = `${before} ${doc}`
    }
    changeSpec = {
        from: startIdx,
        to: endIdx,
        insert: insertText,
    }
    editor.dispatch({
        changes: changeSpec,
    })
    editor.focus()
}

function addList(editor: EditorView, type: 'ul' | 'ol') {
    const pos = editor.state.doc.length
    let mark = '-'
    if (type === 'ol') {
        mark = '1.'
    }
    let template = ''
    for (let i = 0; i < 3; i++) {
        template += `${mark}\n`
    }
    const spec: ChangeSpec = {
        from: pos,
        to: pos,
        insert: `\n${template}`,
    }
    editor.dispatch({ changes: spec })
    editor.focus()
}

function addKatex(editor: EditorView, text: string) {
    editor.focus()
}

function addMath(editor: EditorView, text: string) {
    editor.focus()
}

function appendTable(editor: EditorView) {
    const pos = editor.state.doc.length
    let template = `| header 1 | header 2 | header 3 |\n| -------- | -------- | -------- |\n| content 1 | content 2 | content 3 |\n| -------- | -------- | -------- |\n| content 1 | content 2 | content 3 |\n`
    const spec: ChangeSpec = {
        from: pos,
        to: pos,
        insert: `\n${template}`,
    }
    editor.dispatch({ changes: spec })
    editor.focus()
}

function appendImage(editor: EditorView) {
    const pos = editor.state.doc.length
    let template = `![title](url)`
    const spec: ChangeSpec = {
        from: pos,
        to: pos,
        insert: `\n${template}`,
    }
    editor.dispatch({ changes: spec })
    editor.focus()
}

function appendCodeBlock(editor: EditorView) {
    const pos = editor.state.doc.length
    let template = '` `'
    const spec: ChangeSpec = {
        from: pos,
        to: pos,
        insert: `${template}`,
    }
    editor.dispatch({ changes: spec })
}

export const defaultActions: ISvemdAction[] = [
    {
        label: 'H1',
        icon: icons.h1,
        handler: {
            type: 'action',
            click: (context: ISvemdActionContext) => {
                wrapText(context.editor, '#')
            },
        },
    },
    {
        label: 'H2',
        icon: icons.h2,
        handler: {
            type: 'action',
            click: (context: ISvemdActionContext) => {
                wrapText(context.editor, '#'.repeat(2))
            },
        },
    },
    {
        label: 'H3',
        icon: icons.h3,
        handler: {
            type: 'action',
            click: (context: ISvemdActionContext) => {
                wrapText(context.editor, '#'.repeat(3))
            },
        },
    },
    {
        label: 'h4',
        icon: icons.h4,
        handler: {
            type: 'action',
            click: (context: ISvemdActionContext) => {
                wrapText(context.editor, '#'.repeat(4))
            },
        },
    },
    {
        label: 'h5',
        icon: icons.h5,
        handler: {
            type: 'action',
            click: (context: ISvemdActionContext) => {
                wrapText(context.editor, '#'.repeat(5))
            },
        },
    },
    {
        label: 'h6',
        icon: icons.h6,
        handler: {
            type: 'action',
            click: (context: ISvemdActionContext) => {
                wrapText(context.editor, '#'.repeat(6))
            },
        },
    },
    {
        label: 'B',
        icon: icons.bold,
        handler: {
            type: 'action',
            click: (context: ISvemdActionContext) => {
                wrapText(context.editor, '**', '**')
            },
        },
    },
    {
        label: 'I',
        icon: icons.italic,
        handler: {
            type: 'action',
            click: (context: ISvemdActionContext) => {
                wrapText(context.editor, '*', '*')
            },
        },
    },
    {
        label: 'ol',
        icon: icons.ol,
        handler: {
            type: 'action',
            click: (context: ISvemdActionContext) => {
                addList(context.editor, 'ol')
            },
        },
    },
    {
        label: 'ul',
        icon: icons.ul,
        handler: {
            type: 'action',
            click: (context: ISvemdActionContext) => {
                addList(context.editor, 'ul')
            },
        },
    },
    {
        label: 'Code',
        icon: icons.code,
        handler: {
            type: 'action',
            click: (context: ISvemdActionContext) => {
                appendCodeBlock(context.editor)
            },
        },
    },
    {
        label: 'quote',
        icon: icons.quote,
        handler: {
            type: 'action',
            click: (context: ISvemdActionContext) => {
                wrapText(context.editor, '>')
            },
        },
    },
]
