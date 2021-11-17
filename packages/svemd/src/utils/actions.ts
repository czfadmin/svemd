import { EditorView } from '@codemirror/view'
import { ChangeSpec, SelectionRange, TransactionSpec } from '@codemirror/state'
import { ISvemdAction, ISvemdActionContext } from './../types/actions'
import selectFiles from 'select-files'

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

function addKatex(editor: EditorView, text: string) {}

function addMath(editor: EditorView, text: string) {}

function appendTable(editor: EditorView) {
    const pos = editor.state.doc.length
    let template = `| header 1 | header 2 | header 3 |\n| -------- | -------- | -------- |\n| content 1 | content 2 | content 3 |\n| -------- | -------- | -------- |\n| content 1 | content 2 | content 3 |\n`
    const spec: ChangeSpec = {
        from: pos,
        to: pos,
        insert: `\n${template}`,
    }
    editor.dispatch({ changes: spec })
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
}

async function handleUploadImage(ctx: ISvemdActionContext, files: File[]) {
    const originPos = ctx.editor.state.doc.length
    const { uploadImages } = ctx
    const imgs = await uploadImages(files)
    const spec: ChangeSpec = {
        from: originPos,
        to: originPos,
        insert: `\n${imgs
            .map((img) => `![${img.title}](${img.url})`)
            .join('\n')}`,
    }
    ctx.editor.dispatch({ changes: spec })
    const newPos= ctx.editor.state.doc.length
    ctx.editor.state.selection.replaceRange(SelectionRange.fromJSON({
        from: originPos,
        to:newPos
    }))
    ctx.editor.focus()
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
        type: 'svemd-action-h1',
        label: 'H1',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, '#')
        },
    },
    {
        type: 'svemd-action-h2',
        label: 'H2',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, '#'.repeat(2))
        },
    },
    {
        type: 'svemd-action-h3',
        label: 'H3',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, '#'.repeat(3))
        },
    },
    {
        type: 'svemd-action-h4',
        label: 'h4',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, '#'.repeat(4))
        },
    },
    {
        type: 'svemd-action-h5',
        label: 'h5',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, '#'.repeat(5))
        },
    },
    {
        type: 'svemd-action-h6',
        label: 'h6',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, '#'.repeat(6))
        },
    },
    {
        type: 'svemd-action-bold',
        label: 'B',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, '**', '**')
        },
    },
    {
        type: 'svemd-action-Italic',
        label: 'I',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, '*', '*')
        },
    },
    {
        type: 'svemd-action-order-list',
        label: 'ol',
        action: (context: ISvemdActionContext) => {
            addList(context.editor, 'ol')
        },
    },
    {
        type: 'svemd-action-list',
        label: 'ul',
        action: (context: ISvemdActionContext) => {
            addList(context.editor, 'ul')
        },
    },
    {
        type: 'svemd-action-math',
        label: 'M',
        action: (context: ISvemdActionContext) => {
            addMath(context.editor, 'Italic')
        },
    },
    {
        type: 'svemd-action-Katex',
        label: 'K',
        action: (context: ISvemdActionContext) => {
            addKatex(context.editor, 'Italic')
        },
    },
    {
        type: 'svemd-action-table',
        label: 'Table',
        action: (context: ISvemdActionContext) => {
            appendTable(context.editor)
        },
    },
    {
        type: 'svemd-action-code',
        label: 'Code',
        action: (context: ISvemdActionContext) => {
            appendCodeBlock(context.editor)
        },
    },
    {
        type: 'svemd-action-quote',
        label: 'quote',
        action: (context: ISvemdActionContext) => {
            wrapText(context.editor, '>')
        },
    },
    {
        type: 'svemd-action-image',
        label: 'Image',
        action: async (context: ISvemdActionContext) => {
            const fileList = await selectFiles({
                accept: 'image/*',
                multiple: false,
            })
            if (fileList?.length) {
                await handleUploadImage(context, Array.from(fileList))
            }
        },
    },
]

export const advancedActions: ISvemdAction[] = [
    {
        type: 'svemd-action-split',
        label: 'split',
        action: (context: ISvemdActionContext) => {
            // wrapTextWithBoldOrItalic(context.editor, 'Italic')
        },
    },
    {
        type: 'svemd-action-help',
        label: 'help',
        action: (context: ISvemdActionContext) => {
            // wrapTextWithBoldOrItalic(context.editor, 'Italic')
        },
    },
    {
        type: 'svemd-action-toc',
        label: 'Toc',
        action: (context: ISvemdActionContext) => {
            // wrapTextWithBoldOrItalic(context.editor, 'Italic')
        },
    },
]
