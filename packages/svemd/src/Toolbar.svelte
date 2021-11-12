<script lang="ts">
    import { EditorView } from '@codemirror/view'

    import { ISvemdAction } from './types/actions'


    export let editor: EditorView
    export let actions: ISvemdAction[] = []

    function handleAction(action: ISvemdAction) {
        const { action: _innerAction } = action
        if (_innerAction) {
            _innerAction({
                editor,
            })
        }
    }
</script>

<div class="toolbar">
    {#each actions as action, index (action.label)}
        <button on:click={(e) => handleAction(action)}>{action.label}</button>
    {/each}
</div>
