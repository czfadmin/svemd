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

<div class="toolbar">
    <div class="basic-actions">
        {#each actions as action, index (action.label)}
            <button on:click={(e) => handleAction(action)}
                >{action.label}</button
            >
        {/each}
    </div>
    <span style="flex:1" />
    <div class="advanced-actions">
        {#each advancedActions as action, index (action.label)}
            <button on:click={(e) => handleAction(action)}
                >{action.label}</button
            >
        {/each}
    </div>
</div>

<style lang="less">
    .toolbar,
    .basic-actions,
    .advanced-actions {
        display: flex;
        flex-direction: row;
        flex-wrap: unset;
        justify-content: flex-start;
        align-items: center;
        background-color: #fafafa;
        border-bottom: 1px solid #e0e0e0;
    }
    .basic-actions,
    .advanced-actions {
        width: auto;
    }
</style>
