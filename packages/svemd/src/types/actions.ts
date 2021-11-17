import { EditorView } from '@codemirror/view'
import type { Image } from 'mdast'

export interface ISvemdActionContext {
    editor: EditorView
    uploadImages: (
        files: File[]
    ) => Promise<Pick<Image, 'url' | 'title' | 'alt'>[]>
}
export interface ISvemdAction {
    type: string
    label: string
    action: (context: ISvemdActionContext) => void
}
