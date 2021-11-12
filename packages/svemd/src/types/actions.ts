import { EditorView } from '@codemirror/view'

export interface ISvemdActionContext {
    editor: EditorView
}
export interface ISvemdAction {
    type: string
    label: string
    action: (context: ISvemdActionContext) => void

}
