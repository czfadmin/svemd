import  { Processor } from "unified";
import  {VFile} from "vfile";
import { EditorView } from "@codemirror/view";

export type SvemdEditor = EditorView;

export interface SvemdEditorContext {

    editor: SvemdEditor;
    root: HTMLElement;
}

export interface SvemdViewerContext {
    markdownBody: HTMLElement;
    file: VFile;
}

export interface SvemdPlugin {
    remark?: (p: Processor) => Processor;
    rehype?: (p: Processor) => Processor;
    viewerEffect?(ctx: SvemdViewerContext): void | (() => void);
    editorEffect?(ctx: SvemdEditorContext): void | (() => void);
}
