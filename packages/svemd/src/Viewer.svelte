<script lang="ts">
    import type { VFile } from 'vfile'
    import type { Text } from '@codemirror/text'
    import type { SvemdPlugin } from './types/plugins'
    import getProcessor from './utils/parser'
    import { afterUpdate, onDestroy } from 'svelte'

    export let value: Text
    export let plugins: SvemdPlugin[] = []

    let markdownBody: HTMLElement
    let file: VFile
    let i: number = 0
    let cbs: any[] = []

    function on() {
        cbs = plugins.map((plugin) =>
            plugin.viewerEffect?.({ markdownBody, file })
        )
    }

    function off() {
        cbs.forEach((cb) => cb?.())
    }

    $: try {
        file = getProcessor([...plugins]).processSync(value.toString().trim())
        i++
    } catch (e) {
        console.log(e)
    }

    $: html = `${file}<!--${i}-->`

    afterUpdate(() => {
        off()
        on()
    })

    onDestroy(() => {
        off()
    })
</script>

<div class="svemd-viewer" bind:this={markdownBody}>
    {@html html}
</div>

<style lang="less">
    .svemd-viewer {
        width: 100%;
        padding: 0.5rem;
    }
</style>
