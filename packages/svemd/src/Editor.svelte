<script lang="ts">
    import { autocompletion } from '@codemirror/autocomplete'
    import { EditorState } from '@codemirror/state'
    import {
        EditorView,
        highlightActiveLine,
        keymap,
        ViewUpdate,
    } from '@codemirror/view'
    import { Text } from '@codemirror/text'
    import { defaultKeymap, indentWithTab } from '@codemirror/commands'
    import type { Image } from 'mdast'

    import { onMount, onDestroy } from 'svelte'
    import { debounce } from 'lodash'

    // custom bar
    import Viewer from './Viewer.svelte'
    import Statusbar from './Statusbar.svelte'
    import Toolbar from './Toolbar.svelte'
    import { SvemdPlugin } from './types/plugins'
    import { ISvemdAction, ISvemdActionContext } from './types/actions'
    import { defaultActions } from './utils/actions'
    import { lightTheme } from './themes'

    let editor: EditorView
    let actions: ISvemdAction[] = []

    // props
    export let value: string = `Hello World`
    export let plugins: SvemdPlugin[] = []
    export let uploadImages: (
        files: File[]
    ) => Promise<Pick<Image, 'url' | 'title' | 'alt'>[]>

    let debouncedValue = Text.of([value])

    const setDebouncedValue = debounce((doc: Text) => {
        debouncedValue = doc
    }, 300)

    onMount(() => {
        let defaultState = EditorState.create({
            doc: debouncedValue,
            extensions: [
                keymap.of([...defaultKeymap, indentWithTab]),
                lightTheme,
                highlightActiveLine(),
                EditorView.lineWrapping,
                EditorState.tabSize.of(4),
                autocompletion(),
                EditorView.updateListener.of((update: ViewUpdate) => {
                    if (update.docChanged) {
                        setDebouncedValue(update.state.doc)
                    }
                }),
            ],
        })
        let parent = document.getElementById('svemd-editor')
        editor = new EditorView({
            state: defaultState,
            parent: parent!!,
        })
    })

    onDestroy(() => {
        if (editor) {
            editor.destroy()
        }
    })

    $: styles = (() => {
        let edit: string
        let preview: string
        edit = 'width:50%'
        preview = 'width:50%'
        return { edit, preview }
    })()

    $: _actions = [...defaultActions, ...actions]
    $: ctx = {
        editor,
        uploadImages,
    } as ISvemdActionContext
</script>

<div class="svemd-editor-container ">
    <Toolbar actions={_actions} svemdCtx={ctx} />
    <div class="editor-container">
        <div id="svemd-editor" style={styles.edit} class="svemd-editor" />
        <div style={styles.preview} class="svemd-viewer-container">
            <Viewer value={debouncedValue} {plugins} />
        </div>
    </div>
    <Statusbar {debouncedValue} />
</div>

<style lang="less">
    .svemd-editor-container {
        display: flex;
        margin: 0.25rem;
        flex-direction: column;
        border: 1px solid #ccc;
        border-radius: 4px;
        .editor-container {
            width: 100%;
            display: flex;
            min-height: 100%;
            .svemd-editor {
                padding: 0.5rem;
                border-right: 1px solid #ccc;
            }
        }
    }
</style>
