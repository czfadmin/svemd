<script lang="ts">
    import { Editor } from 'svemd'
    import gfm from '@svemd/plugin-gfm'
    import { onMount } from 'svelte'
    import axios from 'axios'
    let value = 'Hello'
    let request = undefined

    onMount(() => {
        request = axios.create({
            baseURL: 'http://localhost:3002',
            timeout: 1000,
            headers: { 'X-Custom-Header': 'foobar' },
        })
        request.get('/').then((res) => {
            value = res.data
        })
    })
</script>

<main>
    <Editor plugins={[gfm()]} {value} />
</main>

<style lang="less">
    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }

    :global(.svemd) {
        height: calc(100vh - 4px) !important;
    }
</style>
