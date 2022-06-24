<script lang="ts">
    import type { VFile } from 'vfile'
    import type { Text } from '@codemirror/text'
    import getProcessor from './utils/parser'
    import { afterUpdate, createEventDispatcher, onDestroy, tick } from 'svelte'
    import { ISvemdPlugin } from '.'

    // props
    export let value: Text
    export let plugins: ISvemdPlugin[] = []

    // variables
    const dispatch = createEventDispatcher()
    let markdownBody: HTMLElement
    let file: VFile
    let i: number = 0
    let cbs: any[] = []

    // methods
    function on() {
        cbs = plugins.map((plugin) => plugin.viewerEffect?.({ markdownBody }))
    }

    function off() {
        cbs.forEach((cb) => cb?.())
    }

    afterUpdate(() => {
        off()
        on()
    })

    onDestroy(() => {
        off()
    })

    $: try {
        file = getProcessor([
            ...plugins,
            {
                rehype: (p) =>
                    p.use(() => (tree: any, file: any) => {
                        tick().then(() => {
                            dispatch('hast', {
                                hast: tree,
                                file,
                            })
                        })
                    }),
            },
        ]).processSync(value.toString().trim())
        i++
    } catch (e) {
        console.log(e)
    }
    $: html = `${file}<!--${i}-->`
</script>

<div class="svemd-viewer markdown-body" bind:this={markdownBody}>
    {@html html}
</div>

<style lang="less">
    .svemd-viewer {
        width: 100%;
        padding: 0.5rem;
    }
</style>
