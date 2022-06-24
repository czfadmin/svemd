<svelte:options immutable={true} />

<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { ISvemdAction, ISvemdActionContext, ISvemdRightAction } from '.'
    import { icons } from './icons'
    import type { DelegateInstance } from 'tippy.js'
    import { delegate } from 'tippy.js'
    import { onMount } from 'svelte'

    export let svemdCtx: ISvemdActionContext
    export let sidebar: boolean | 'help' | 'toc'
    export let activeTab: false | 'write' | 'preview'
    export let fullscreen: boolean = false
    export let split: boolean

    let toolbar: HTMLElement
    let delegateInstance: DelegateInstance

    const dispatch = createEventDispatcher()
    const tippyClass = 'svemd-tippy'
    const tippyClassRight = 'svemd-tippy-right'
    const tippyPathKey = 'svemd-tippy-path'

    function getPayloadFromElement(e: Element) {
        const paths = e
            .getAttribute(tippyPathKey)
            ?.split('-')
            ?.map((x) => parseInt(x, 10))
        if (!paths) return

        let item: ISvemdAction = {
            label: '',
            handler: {
                type: 'dropdown',
                actions: e.classList.contains(tippyClassRight)
                    ? rightActions
                    : actions,
            },
        }
        paths?.forEach((index) => {
            if (item.handler?.type === 'dropdown') {
                item = item.handler.actions[index]
            }
        })

        return { paths, item: item }
    }

    function init() {
        delegateInstance = delegate(toolbar, {
            target: `.${tippyClass}`,
            onCreate: ({ setProps, reference }) => {
                const payload = getPayloadFromElement(reference)
                if (!payload) {
                    return
                }
                const { item, paths } = payload
                const { handler } = item
                if (!handler) return
                if (handler.type === 'action') {
                    setProps({
                        content: item.label,
                        onHidden(ins) {
                            ins.destroy()
                        },
                    })
                } else if (handler.type === 'dropdown') {
                    const dropdown = document.createElement('div')
                    dropdown.classList.add('svemd-dropdown')
                    if (item.label) {
                        const dropdownTitle = document.createElement('div')
                        dropdownTitle.classList.add('svemd-dropdown-title')
                        dropdownTitle.appendChild(
                            document.createTextNode(item.label)
                        )
                        dropdownTitle.appendChild(dropdownTitle)
                    }
                    handler.actions.forEach((subAction, i) => {
                        const dropdownItem = document.createElement('div')
                        dropdownItem.classList.add('svemd-dropdown-item')
                        dropdownItem.setAttribute(
                            tippyPathKey,
                            [...paths, i].join('-')
                        )
                        if (subAction.handler?.type === 'dropdown') {
                            dropdownItem.classList.add(tippyClass)
                        }
                        if (reference.classList.contains(tippyClassRight)) {
                            dropdownItem.classList.add(tippyClassRight)
                        }
                        dropdownItem.innerHTML = `${
                            subAction.icon
                                ? `<div class="svemd-dropdown-item-icon">${subAction.icon}</div>`
                                : ''
                        }<div class="svemd-dropdown-item-title">${
                            subAction.label
                        }</div>`
                        dropdown.appendChild(dropdownItem)
                    })
                    setProps({
                        allowHTML: true,
                        showOnCreate: true,
                        theme: 'light-border',
                        placement: 'bottom-start',
                        interactive: true,
                        interactiveDebounce: 50,
                        arrow: true,
                        offset: [0, 4],
                        content: dropdown.outerHTML,
                        onHidden: (ins) => {
                            ins.destroy()
                        },
                        onCreate: (ins) => {
                            ;[
                                ...ins.popper.querySelectorAll(
                                    '.svemd-dropdown-item'
                                ),
                            ].forEach((el, i) => {
                                const actionHandler =
                                    handler.actions[i]?.handler
                                if (actionHandler?.type === 'action') {
                                    el.addEventListener('mouseenter', () => {
                                        const { mouseenter, mouseleve } =
                                            actionHandler
                                        if (mouseenter) {
                                            el.addEventListener(
                                                'mouseenter',
                                                () => {
                                                    mouseenter(svemdCtx)
                                                }
                                            )
                                        }
                                        if (mouseleve) {
                                            el.addEventListener(
                                                'mouseenter',
                                                () => {
                                                    mouseleve(svemdCtx)
                                                }
                                            )
                                        }
                                    })
                                }
                            })
                        },
                    })
                }
            },
        })
    }

    function handleClick(e: MouseEvent) {
        const target = (e.target as Element).closest(`[${tippyPathKey}]`)
        if (!target) {
            return
        }
        const handler = getPayloadFromElement(target)?.item?.handler
        if (handler?.type === 'action') {
            handler.click(svemdCtx)
        }
        // delegateInstance?.destroy()
        init()
    }

    onMount(() => {
        init()
    })

    $: tocActive = sidebar === 'toc'
    $: helpActive = sidebar === 'help'
    $: writeActive = activeTab === 'write'
    $: previewActive = activeTab === 'preview'
    $: actions = svemdCtx.actions
    $: rightActions = [
        {
            label: tocActive ? 'Close table of contents' : 'Toc',
            icon: icons.toc,
            handler: {
                type: 'action',
                click() {
                    dispatch('click', 'toc')
                },
            },
            active: tocActive,
        },
        {
            label: helpActive ? '关闭帮助' : '帮助',
            icon: icons.help,
            handler: {
                type: 'action',
                click() {
                    dispatch('click', 'help')
                },
            },
            active: helpActive,
        },

        {
            label: writeActive ? 'Auto' : 'Write',
            icon: icons.left,
            handler: {
                type: 'action',
                click: () => {
                    dispatch('tab', 'write')
                },
            },
            active: writeActive,
            hidden: !split,
        },
        {
            label: previewActive ? 'Auto' : 'Preview',
            icon: icons.right,
            handler: {
                type: 'action',
                click: () => {
                    dispatch('tab', 'preview')
                },
            },
            active: previewActive,
            hidden: !split,
        },
        {
            label: fullscreen ? '退出全屏' : '全屏',
            icon: fullscreen ? icons.fullscreenOff : icons.fullscreenOn,
            handler: {
                type: 'action',
                click() {
                    dispatch('click', 'fullscreen')
                },
            },
        },
    ] as ISvemdRightAction[]
</script>

<div class="svemd-toolbar" bind:this={toolbar} on:click={handleClick}>
    <div class="svemd-left-actions">
        {#each actions as action, index (action.label)}
            <div
                class={['svemd-toolbar-icon', tippyClass].join(' ')}
                svemd-tippy-path={index}
            >
                {@html action.icon}
            </div>
        {/each}
    </div>
    <span style="flex:1" />
    <div class="svemd-right-actions">
        {#each rightActions as item, index (item.label)}
            <div
                class={['svemd-toolbar-icon', tippyClass, tippyClassRight].join(
                    ' '
                )}
                class:svemd-toolbar-icon-active={item.active}
                svemd-tippy-path={index}
            >
                {@html item.icon}
            </div>
        {/each}
    </div>
</div>

<style lang="less">
    @border-color: #e0e0e0;
    @sidebar-width: 280px;
    .svemd {
        &-toolbar {
            display: flex;
            .svemd-left-actions,
            .svemd-right-actions {
                display: flex;
            }
            .svemd-toolbar-icon {
                // display: flex;
                max-width: fit-content;
                margin: 0.1rem;
                padding: 0.25rem 0.35rem;
                cursor: pointer;
                border: 1px solid #ccc;
                border-radius: 4px;
                &:active {
                    background-color: rgb(226, 226, 226);
                }
                &:hover {
                    background-color: rgba(235, 233, 233, 0.904);
                }
            }
        }
        &-tippy {
            background: white;
        }
        // dropdown
        &-dropdown {
            max-height: 300px;
            overflow: auto;
            font-size: 14px;
            &-title {
                // margin: 0 12px;
                // font-weight: 500;
                // border-bottom: 1px solid @border-color;
                // line-height: 32px;
                // color: $gray-700;
            }
            &-item {
                padding: 4px 12px;
                height: 32px;
                cursor: pointer;
                &:hover {
                    // background-color: $gray-100;
                }

                &-icon {
                    display: inline-block;
                    svg {
                        display: block;
                        padding: 4px;
                        width: 24px;
                        height: 24px;
                    }
                }
                &-title {
                    display: inline-block;
                    line-height: 24px;
                    vertical-align: top;
                }
            }
        }
    }
</style>
