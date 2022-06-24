<script lang="ts">
    import { autocompletion } from '@codemirror/autocomplete'
    import { closeBrackets } from '@codemirror/closebrackets'
    import { ChangeSpec, EditorState } from '@codemirror/state'
    import {basicSetup} from '@codemirror/basic-setup'
    import {
        EditorView,
        highlightActiveLine,
        keymap,
        ViewUpdate,
    } from '@codemirror/view'
    import { Text } from '@codemirror/text'
    import { defaultKeymap, indentWithTab } from '@codemirror/commands'
    import { onMount, onDestroy, tick } from 'svelte'
    import { debounce } from 'lodash'
    import { Root } from 'hast'
    import { VFile } from 'vfile'

    import { ISvemdAction, ISvemdActionContext, ISvemdPlugin } from '.'
    import { defaultActions } from './utils/actions'
    import Statusbar from './Statusbar.svelte'

    //  Components
    import Viewer from './Viewer.svelte'
    import Toolbar from './Toolbar.svelte'
    import Toc from './Toc.svelte'
    import Help from './Help.svelte'
    import { icons } from './icons'

    // props
    export let value: string = `# Hello World`
    export let plugins: ISvemdPlugin[] = []

    // variables
    let editor: EditorView
    let actions: ISvemdAction[] = defaultActions

    let containerWidth = Infinity
    let rootEl: HTMLElement
    let editorEl: HTMLElement
    let previewEl: HTMLElement
    let activeTab: false | 'write' | 'preview' = false
    let fullscreen: boolean = false
    let sidebar: false | 'help' | 'toc' = false
    let mode: 'split' | 'tab' | 'auto' = 'auto'
    let hast: Root = {
        type: 'root',
        children: [],
    }
    let vfile: VFile
    let currentBlockIdx = 0
    let previewPs: number[]

    //  Reactive variables
    $: styles = (() => {
        let edit: string
        let preview: string
        if (split && activeTab === false) {
            if (sidebar) {
                edit = `width:calc(50% - ${sidebar ? 140 : 0}px)`
                preview = `width:calc(50% - ${sidebar ? 140 : 0}px)`
            } else {
                edit = 'width:50%'
                preview = 'width:50%'
            }
        } else if (activeTab === 'preview') {
            edit = 'display:none'
            preview = `width:calc(100% - ${sidebar ? 280 : 0}px)`
        } else {
            edit = `width:calc(100% - ${sidebar ? 280 : 0}px)`
            preview = 'display:none'
        }
        return { edit, preview }
    })()

    $: svemdCtx = {
        editor,
        actions,
    } as ISvemdActionContext
    $: split = mode === 'split' || (mode === 'auto' && window.innerWidth > 800)
    $: debouncedValue = Text.of([value])
    $: {
        const _value = Text.of([value])
        const changeSpec: ChangeSpec = {
            from: 0,
            to: 0,
            insert: _value,
        }
        if (editor) {
            editor.dispatch({
                changes: changeSpec,
                // sequential: true,
            })

        }
    }

    // methods
    const setDebouncedValue = debounce((doc: Text) => {
        debouncedValue = doc
    }, 300)

    const editorScrollHandler = () => {}
    function findStartIndex(num: number, nums: number[]) {
        let startIndex = nums.length - 2
        for (let i = 0; i < nums.length; i++) {
            if (num < nums[i]) {
                startIndex = i - 1
                break
            }
        }
        startIndex = Math.max(startIndex, 0) // ensure >= 0
        return startIndex
    }
    const previewScrollHandler = () => {
        // if (overridePreview) return

        // find the current block in the view
        // updateBlockPositions()
        currentBlockIdx = findStartIndex(
            previewEl.scrollTop /
                (previewEl.scrollHeight - previewEl.offsetHeight),
            previewPs
        )

        // if (!syncEnabled) return

        // if (editCalled) {
        //     editCalled = false
        //     return
        // }

        // const rightRatio =
        //     previewEl.scrollTop /
        //     (previewEl.scrollHeight - previewEl.clientHeight)

        // const startIndex = findStartIndex(rightRatio, previewPs)

        // const leftRatio =
        //     ((rightRatio - previewPs[startIndex]) *
        //         (editPs[startIndex + 1] - editPs[startIndex])) /
        //         (previewPs[startIndex + 1] - previewPs[startIndex]) +
        //     editPs[startIndex]

        // const info = editor.getScrollInfo()
        // editor.scrollTo(0, leftRatio * (info.height - info.clientHeight))
        // previewCalled = true
    }

    onMount(() => {
        let defaultState = EditorState.create({
            extensions: [
                // basicSetup,
                keymap.of([...defaultKeymap, indentWithTab]),
                highlightActiveLine(),
                // closeBrackets(),
                autocompletion(),
                EditorView.lineWrapping,
                EditorState.tabSize.of(4),
                EditorState.lineSeparator.of('\n'),
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
        //  todo
        // editor.on('scroll', editorScrollHandler)
        previewEl.addEventListener('scroll', previewScrollHandler, {
            passive: true,
        })
    })

    onDestroy(() => {
        if (editor) {
            editor.destroy()
        }
    })
</script>

<div
    class="svemd"
    bind:this={rootEl}
    class:svemd-split={split && activeTab === false}
    class:svemd-fullscreen={fullscreen}
>
    <Toolbar
        {svemdCtx}
        {sidebar}
        {fullscreen}
        {activeTab}
        {split}
        on:click={(e) => {
            switch (e.detail) {
                case 'fullscreen':
                    fullscreen = !fullscreen
                    break
                case 'help':
                    sidebar = sidebar === 'help' ? false : 'help'
                    break
                case 'toc':
                    sidebar = sidebar === 'toc' ? false : 'toc'
                    break
            }
        }}
        on:tab={(e) => {
            const v = e.detail
            if (split) {
                activeTab = activeTab === v ? false : v
            } else {
                activeTab = v
            }
            if (activeTab === 'write') {
                tick().then(() => {
                    editor && editor.focus()
                })
            }
        }}
    />
    <div class="svemd-container">
        <div
            class="svemd-editor"
            id="svemd-editor"
            style={styles.edit}
            bind:this={editorEl}
        />
        <div class="svemd-preview" style={styles.preview} bind:this={previewEl}>
            <Viewer
                {plugins}
                value={debouncedValue}
                on:hast={(e) => {
                    hast = e.detail.hast
                    vfile = e.detail.file
                }}
            />
        </div>
        <div class="svemd-sidebar" class:svemd-hidden={sidebar === false}>
            <div class="svemd-sidebar-close" on:click={() => (sidebar = false)}>
                {@html icons.close}
            </div>
            <Toc
                {currentBlockIdx}
                {hast}
                on:click={(e) => {
                    const headings =
                        previewEl.querySelectorAll('h1,h2,h3,h4,h5,h6')
                    headings[e.detail].scrollIntoView()
                }}
                visible={sidebar === 'toc'}
            />
            <Help visible={sidebar === 'help'} />
        </div>
    </div>
    <Statusbar
        {debouncedValue}
        on:top={() => {
            editor.posAtCoords({ x: 0, y: 0 })
            previewEl.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        }}
    />
</div>

<style lang="less">
    @border-color: #e0e0e0;
    @sidebar-width: 280px;
    .svemd {
        display: flex;
        flex-direction: column;
        width: calc(100% - 2px);
        height: 300px;
        border: 1px solid #ccc;
        border-radius: 4px;
        position: relative;
        &-container {
            display: flex;
            width: 100%;
            height: calc(100% - 32px - 25px);
            max-height: max-content;
            border-top: 1px solid #ccc;
            overflow: auto;
            overflow-x: hidden;
        }
        &-editor {
            padding: 0.25rem;
            display: inline-block;
            vertical-align: top;
            height: 100%;
            overflow: hidden;
            .cm-editor {
                height: 100%;
                font-size: 14px;
                line-height: 1.5;
                background-color: red;
                pre.CodeMirror-placeholder {
                    // color: $gray-400;
                }
                .cm-line {
                    // max-width: $max-width;
                    margin: 0 auto;
                    padding: 16px 0;
                }
                pre.CodeMirror-line,
                pre.CodeMirror-line-like {
                    padding: 0 4%;
                }
            }
        }

        // fullscreen
        &-fullscreen {
            &.svemd {
                z-index: 9999;
                position: fixed;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                border: none;
                height: 100vh !important; // override user set height
            }
        }
        &-split {
            .svemd-preview {
                border-left: 1px solid #ccc;
            }
        }
        &-hidden {
            display: none !important;
        }
        // sidebar
        &-sidebar {
            display: inline-block;
            vertical-align: top; // Safari
            // height: 100%;
            overflow: auto;
            font-size: 16px;
            border-left: 1px solid @border-color;
            width: @sidebar-width;
            position: relative;
            padding: 0 16px;
            &-close {
                position: absolute;
                padding: 16px;
                top: 0;
                right: 0;
                cursor: pointer;
                &:hover {
                    color: blue;
                }
            }
            h2 {
                font-size: 16px;
                font-weight: 600;
                margin: 32px 0 16px;
            }
            ul {
                padding-left: 0;
                color: gray;
            }
        }
    }
</style>
