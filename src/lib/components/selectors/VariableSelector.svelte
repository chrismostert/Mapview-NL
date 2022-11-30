<script>
    import { csv_data, selected_variable } from "../../store.js";
    let variables = [];

    $: {
        const res = new Set();
        for (const i in $csv_data.data) {
            res.add($csv_data.data[i].name);
        }
        variables = [...res];
    }

    $: if (!$selected_variable && variables.length > 0) {
        $selected_variable = variables[0];
    }
</script>

{#if $selected_variable}
    <select bind:value={$selected_variable}>
        {#each variables as variable}
            <option value={variable}>{variable}</option>
        {/each}
    </select>
{/if}
