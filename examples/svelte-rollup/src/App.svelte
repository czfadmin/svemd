<script lang="ts">
    import { Editor } from 'svemd'
    export let name
</script>

<main>
    <Editor/>
</main>

<style>
    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
