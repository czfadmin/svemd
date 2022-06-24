import { EditorView } from '@codemirror/view'
import { Processor } from 'unified'

export type SvemdEditor = EditorView

//  编辑器选项
export interface ISvemdEditorOption {}

// 预览器选项
export interface ISvemdViewerOption {}

//  全局配置
export interface ISvemdGlobalOption {}

// Svemd 插件
export interface ISvemdPlugin {
    remark?: (p: Processor) => Processor
    rehype?: (p: Processor) => Processor
    viewerEffect?(ctx: ISvemdViewerContext): void | (() => void)
    editorEffect?(ctx: ISvemdEditorContext): void | (() => void)
}

//  编辑器上下文
export interface ISvemdEditorContext {
    editor: SvemdEditor
    root: HTMLElement
}
// 预览器上下文
export interface ISvemdViewerContext {
    markdownBody: HTMLElement
}

type ClickListener = (ctx: ISvemdActionContext) => void
type MouseListener = ClickListener
export type SvemdActionHandler =
    | {
          type: 'action'
          click: ClickListener
          shortcut?: string
          mouseenter?: MouseListener
          mouseleve?: MouseListener
      }
    | {
          type: 'dropdown'
          actions: ISvemdAction[]
      }

export interface ISvemdAction {
    label: string
    icon?: string
    cheatsheet?: string
    handler: SvemdActionHandler
}

export interface ISvemdActionContext {
    editor: SvemdEditor
    actions: ISvemdAction[]
}

export interface ISvemdRightAction extends ISvemdAction {
    hidden?: boolean
    active?: boolean
}
