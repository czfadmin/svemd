<script lang="ts">
    import type { Text } from '@codemirror/text'
    import { createEventDispatcher } from 'svelte'

    export let debouncedValue: Text
    export let syncDoc: boolean = false

    const dispatch = createEventDispatcher()
    function handleScrollToTop() {
        dispatch('top')
    }

    $: count = (() => {
        let count = 0
        if (debouncedValue) {
            let doc = debouncedValue
            let iter = doc.iter()
            while (!iter.next().done) {
                let inWord = false
                for (let i = 0; i < iter.value.length; i++) {
                    let word = /\w/.test(iter.value[i])
                    if (word && !inWord) count++
                    inWord = word
                }
            }
        }
        return count
    })()
</script>

<div class="svemd-statusbar">
    <p>Word Count: {count}</p>
    <span style="flex:1" />
    <div class="statusbar-right">
        <div class="container">
            <input
                type="checkbox"
                id="svemd-sync-doc"
                checked={syncDoc}
                onchange={() => {
                    console.log()
                }}
            />
            <label for="svemd-sync-doc">Sync Doc</label>
        </div>
        <p on:click={handleScrollToTop}>Scroll to Top</p>
    </div>
</div>

<style lang="less">
    .svemd-statusbar {
        display: flex;
        border-top: 1px solid #ccc;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        font-size: 13px;
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        line-height: 24px;
        align-items: center;
        height: 24px;
        .statusbar-right {
            display: flex;
            align-items: center;
            justify-content: space-around;
            height: 24px;
            p,
            label {
                &:hover {
                    color: blue;
                    cursor: pointer;
                }
            }
        }
        .container {
            input {
                padding: 0;
                margin: 0 !important;
                margin-right: 0.2rem;
            }
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 2px;
            margin-right: 2px;
        }
    }
</style>
