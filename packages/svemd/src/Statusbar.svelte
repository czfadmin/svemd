<script lang="ts">
    import type { Text } from '@codemirror/text'

    export let debouncedValue: Text
    export let syncDoc: boolean = false

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

<div class="statusbar">
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
    </div>
</div>

<style lang="less">
    .statusbar {
        display: flex;
        width: 100%;
    }
    .container {
        input {
            padding: 0;
            margin: 0  !important;
            margin-right:0.2rem;
        }
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
