<script>
    import {
        csv_data,
        selected_variable,
        selected_data,
        min_value,
        max_value,
    } from "../../store.js";
    let variables = [];

    // If csv data changes, find unique variables
    $: {
        const res = new Set();
        for (const i in $csv_data?.data) {
            res.add($csv_data.data[i].name);
        }
        variables = [...res];
    }

    // If no variable is selected, select the first one
    $: if (!$selected_variable && variables.length > 0) {
        $selected_variable = variables[0];
    }

    // Set selected data if selected variable changes
    $: $selected_data = $csv_data?.data.filter(
        (d) => d.name == $selected_variable
    );

    // Set min and max values
    $: {
        let min = Infinity;
        let max = -Infinity;

        for (let d in $selected_data) {
            let val = $selected_data[d].value;
            if (val < min) {
                min = val;
            }
            if (val > max) {
                max = val;
            }
        }

        $min_value = min;
        $max_value = max;
    }
</script>

{#if $selected_variable}
    <label for="variable_select">Selecteer variabele:</label>
    <select
        bind:value={$selected_variable}
        name="variable_select"
        id="variable_select"
    >
        {#each variables as variable}
            <option value={variable}>{variable}</option>
        {/each}
    </select>
{/if}
