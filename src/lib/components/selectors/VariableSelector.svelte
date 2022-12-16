<script>
    import {
        csv_data,
        selected_variable,
        selected_date,
        selected_data,
        min_value,
        max_value,
    } from "../../store.js";

    let variables = [];
    let min_date;
    let max_date;
    let date_step;

    function update_ranges($csv_data) {
        if ($csv_data) {
            const unique_variables = new Set();
            let dates = [];
            let min_date_step = Infinity;

            for (const i in $csv_data) {
                unique_variables.add($csv_data[i].name);
                dates.push($csv_data[i].date);
            }

            dates.sort();
            min_date = dates[0];
            max_date = dates[dates.length - 1];

            for (const i in dates) {
                if (i > 1) {
                    let step = dates[i] - dates[i - 1];
                    if (step != 0 && step < min_date_step) {
                        min_date_step = step;
                    }
                }
            }

            variables = [...unique_variables];
            date_step = min_date_step;
            $selected_date = max_date;
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

    // Set selected data if selected variable changes
    $: $selected_data = $csv_data?.filter(
        (d) => d.name == $selected_variable && d.date == $selected_date
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
        min={min_date}
        max={max_date}
        step={date_step}
        bind:value={$selected_date}
    />
    {format_date($selected_date)}
{/if}
