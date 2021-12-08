<script lang="ts">
    import { Editor } from 'svemd'
    import gfm from '@svemd/plugin-gfm'

</script>

<main>
    <Editor plugins={[gfm()]} />
</main>

<style>
    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
