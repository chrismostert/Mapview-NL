<script>
    import { csv_data, selected_variable, selected_date, selected_date_idx } from "../store.js";

    function format_date(date_epoch) {
        let date = new Date(date_epoch);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }

    const init_selection = (data) => {
        $selected_date_idx = data.ranges.dates.length - 1;
        $selected_variable = data.ranges.variables[0];
    };

    $: if ($csv_data) {
        init_selection($csv_data);
    }

    $: if (isFinite($selected_date_idx)) {
        $selected_date = $csv_data.ranges.dates[$selected_date_idx];
    }
</script>

{#if $csv_data}
    <div class="mb-4">
        <label for="variable_select">Selecteer variabele:</label>
        <select
            bind:value={$selected_variable}
            name="variable_select"
            id="variable_select"
        >
            {#each $csv_data.ranges.variables as variable}
                <option value={variable}>{variable}</option>
            {/each}
        </select>
    </div>

    <label for="date_select">Datum:</label>
    <input
        id="date_select"
        type="range"
        min={0}
        max={$csv_data.ranges.dates.length - 1}
        step={1}
        bind:value={$selected_date_idx}
    />
    {format_date($selected_date)}
{/if}
