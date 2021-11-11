<script lang="ts">
    import { autocompletion } from "@codemirror/autocomplete";
    import { EditorState } from "@codemirror/state";
    import { EditorView, keymap, ViewUpdate } from "@codemirror/view";
    import { Text } from "@codemirror/text";
    import { defaultKeymap } from "@codemirror/commands";
    import { onMount, onDestroy } from "svelte";
    import { debounce } from "lodash";

    // custom bar
    import Viewer from "./Viewer.svelte";
    import Statusbar from "./Statusbar.svelte";
    import Toolbar from "./Toolbar.svelte";
    import { SvemdPlugin } from "./types/plugins";

    let editor: EditorView;

    export let value: string = `Hello World`;
    export let plugins: SvemdPlugin[] = [];
    let debouncedValue = Text.of([value]);

    const setDebouncedValue = debounce((doc: Text) => {
        debouncedValue = doc;
    }, 30);

    onMount(() => {
        let defaultState = EditorState.create({
            doc: debouncedValue,
            extensions: [
                keymap.of(defaultKeymap),
                EditorState.tabSize.of(16),
                autocompletion(),
                EditorView.updateListener.of((update: ViewUpdate) => {
                    if (update.docChanged) {
                        setDebouncedValue(update.state.doc);
                    }
                }),
            ],
        });
        let parent = document.getElementById("svemd-editor");
        editor = new EditorView({
            state: defaultState,
            parent: parent!!,
        });
    });

    onDestroy(() => {
        if (editor) {
            editor.destroy();
        }
    });

    $: styles = (() => {
        let edit: string;
        let preview: string;
        edit = "width:50%";
        preview = "width:50%";
        return { edit, preview };
    })();
</script>

<div class="container">
    <Toolbar />
    <div class="editor-container">
        <div id="svemd-editor" style={styles.edit} class="svemd-editor" />
        <div style={styles.preview} class="svemd-viewer">
            <Viewer value={debouncedValue} {plugins} />
        </div>
    </div>
    <Statusbar {debouncedValue} />
</div>

<style lang="less">
    .container {
        display: flex;
        width: 100%;
        flex-direction: column;
        height: calc(100vh - 50px);
        .editor-container {
            width: 100%;
            display: flex;
            min-height: 100%;
        }
    }
</style>
