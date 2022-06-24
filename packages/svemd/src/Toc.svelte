<!-- https://github.com/bytedance/bytemd/blob/6eb4dc453fbd737f130bab24f7196500a3bf173c/packages/bytemd/src/toc.svelte -->
<svelte:options immutable={true} />

<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import type { Root, Element } from 'hast'

    import { visit } from 'unist-util-visit'

    // props
    export let hast: Root
    export let visible: boolean
    export let currentBlockIdx: number

    // variables
    const dispatch = createEventDispatcher()
    let items: { level: number; text: string }[]
    let minLevel = 6
    let currentHeadingIndex = 0

    function stringifyHeading(e: Element) {
        let result = ''
        visit(e, (node: any) => {
            if (node.type === 'text') {
                result += node.value
            }
        })
        return result
    }

    $: (() => {
        items = []
        currentHeadingIndex = 0
        hast.children
            .filter((v): v is Element => v.type === 'element')
            .forEach((node, index) => {
                if (node.tagName[0] === 'h' && !!node.children.length) {
                    const i = Number(node.tagName[1])
                    minLevel = Math.min(minLevel, i)
                    items.push({
                        level: i,
                        text: stringifyHeading(node),
                    })
                }
                if (currentBlockIdx >= index) {
                    currentHeadingIndex = items.length - 1
                }
            })
    })()
</script>

<div class="svemd-toc" class:bytemd-hidden={!visible}>
    <!-- <h2>{locale.toc}</h2> -->
    <ul>
        {#each items as item, index}
            <li
                class={`svemd-toc-${item.level}`}
                class:svemd-toc-active={currentHeadingIndex === index}
                class:svemd-toc-first={item.level === minLevel}
                style={`padding-left:${(item.level - minLevel) * 16 + 8}px`}
                on:click={() => {
                    dispatch('click', index)
                }}
            >
                {item.text}
            </li>
        {/each}
    </ul>
</div>

<style lang="less">
    @primary: #5268e0;
    @gray: #e0dddd82;
    .svemd {
        &-toc {
            li {
                list-style: none;
                margin-bottom: 4px;
                font-size: 14px;
                line-height: 2;
                cursor: pointer;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            &-active {
                color: @primary;
                background-color: @gray;
                border-radius: 4px;
                padding: 0.25rem;
            }
            &-first {
                font-weight: 500;
            }
        }
    }
</style>
