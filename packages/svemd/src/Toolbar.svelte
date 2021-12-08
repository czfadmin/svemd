<script lang="ts">
    import { EditorView } from '@codemirror/view'

    import { ISvemdAction, ISvemdActionContext } from './types/actions'
    import { advancedActions } from './utils/actions'

    export let actions: ISvemdAction[] = []
    export let svemdCtx: ISvemdActionContext

    function handleAction(action: ISvemdAction) {
        const { action: _innerAction } = action
        if (_innerAction) {
            _innerAction(svemdCtx)
        }
    }
</script>

<div class="svemd-toolbar">
    <div class="svemd-left-actions">
        {#each actions as action, index (action.label)}
            <i on:click={(e) => handleAction(action)}>{action.label}</i>
        {/each}
    </div>
    <span style="flex:1" />
    <div class="svemd-right-actions">
        {#each advancedActions as action, index (action.label)}
            <i on:click={(e) => handleAction(action)}>{action.label}</i>
        {/each}
    </div>
</div>

<style lang="less">
    .svemd-toolbar {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
        border-bottom: 1px solid #ccc;
        .svemd-right-actions,
        .svemd-left-actions {
            display: flex;
            flex-direction: row;
            flex-wrap: unset;
            justify-content: flex-start;
            align-items: center;
            width: auto;
            i {
                padding: 0.25rem;
                margin: auto .1rem;
                font-style: normal;
                display: flex;
                align-items: center;
                justify-content: center;

                &:hover {
                    background-color: #e0e0e0;
                    cursor: pointer;
                    border-radius: 4px;
                }
                &:active {
                    background: gray;
                    transition: background 0.2s;
                }
            }
        }
    }
</style>
