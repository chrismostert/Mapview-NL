<script>
    import { csv_data, selected_variable, selected_date } from "../../store.js";

    let variables = [];

    let selected_date_idx;
    let dates;

    function update_ranges($csv_data) {
        if ($csv_data) {
            const unique_variables = new Set();
            dates = new Set();

            for (const i in $csv_data) {
                unique_variables.add($csv_data[i].name);
                dates.add($csv_data[i].date);
            }

            dates = [...dates];
            dates.sort();

            variables = [...unique_variables];
            selected_date_idx = dates.length - 1;
            $selected_date = dates[selected_date_idx];
            $selected_variable = variables[0];
        }
    }

    function format_date(date_epoch) {
        let date = new Date(date_epoch);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }

    // If csv data changes, find unique variables
    // Also find date range for slider
    $: update_ranges($csv_data);
    $: $selected_date = isFinite(selected_date_idx) ? dates[selected_date_idx] : void 0;
</script>

{#if $selected_variable}
    <div class="mb-4">
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
    </div>

    <label for="date_select">Datum:</label>
    <input
        id="date_select"
        type="range"
        min={0}
        max={dates.length - 1}
        step={1}
        bind:value={selected_date_idx}
    />
    {format_date($selected_date)}
{/if}
<br />
{$selected_date}
