<script lang="ts">
    import type { EditorView } from "@codemirror/view";
    import type {Text} from '@codemirror/text';

    export let debouncedValue:Text


    $: count = (() => {
        let count = 0;
        if (debouncedValue) {
            let doc = debouncedValue;
            let iter = doc.iter();
            while (!iter.next().done) {
                let inWord = false;
                for (let i = 0; i < iter.value.length; i++) {
                    let word = /\w/.test(iter.value[i]);
                    if (word && !inWord) count++;
                    inWord = word;
                }
            }
        }
        return count;
    })();
</script>

<div class="statusbar">
    <p>Word Count: {count}</p>
</div>

<style lang="less">
    .statusbar {
        display: flex;
        width: 100%;
    }
</style>
