<script>
    import { csv_data, selected_variable, selected_date } from "../store.js";
    import { scaleTime, scaleLinear } from "d3-scale";
    import { fade } from "svelte/transition";
    import { stat_hovered } from "../store.js";

    let width = 0;
    let height = 0;

    const padding = {
        top: 50,
        left: 50,
        right: 50,
        bottom: 50,
    };

    let scale_x = scaleTime();
    let scale_y = scaleLinear();

    let min_x, min_y, max_x, max_y;
    let filtered_data;
    let plot_data;

    function scale_data(filtered_data) {
        let plot_data_dict = {};

        for (let idx in filtered_data) {
            let { stat_code, date, value } = filtered_data[idx];

            if (!plot_data_dict[stat_code])
                plot_data_dict[stat_code] = {
                    stat_code: stat_code,
                    points: [],
                };

            plot_data_dict[stat_code].points.push(
                `${scale_x(date)},${scale_y(value)}`
            );
        }

        for (let stat_code in plot_data_dict) {
            plot_data_dict[stat_code].points =
                plot_data_dict[stat_code].points.join(" ");
        }

        return Object.values(plot_data_dict);
    }

    function handle_resize(width, height) {
        scale_x.range([padding.left, width - padding.right]);
        scale_y.range([height - padding.bottom, padding.top]);
        plot_data = scale_data(filtered_data);
    }

    function update_data(selected_variable) {
        filtered_data = $csv_data?.filter((d) => d.name === selected_variable);

        let xvals = filtered_data?.map((d) => d.date);
        let yvals = filtered_data?.map((d) => d.value);

        if (xvals && yvals) {
            min_x = Math.min(...xvals);
            min_y = Math.min(...yvals);
            max_x = Math.max(...xvals);
            max_y = Math.max(...yvals);
        }

        scale_x.domain([min_x, max_x]);
        scale_y.domain([0, max_y]);
        plot_data = scale_data(filtered_data);
    }

    $: handle_resize(width, height);
    $: update_data($selected_variable);
</script>

<div class="w-full h-full" bind:clientWidth={width} bind:clientHeight={height}>
    <svg width="100%" height="100%">
        <g>
            <line
                x1={padding.left}
                x2={width - padding.right}
                y1={height - padding.bottom}
                y2={height - padding.bottom}
                stroke="black"
                stroke-width="1"
            />
            <line
                x1={padding.left}
                x2={padding.left}
                y1={padding.top}
                y2={height - padding.bottom}
                stroke="black"
                stroke-width="1"
            />
            {#if $selected_date}
                <line
                    x1={scale_x($selected_date)}
                    x2={scale_x($selected_date)}
                    y1={padding.top}
                    y2={height - padding.bottom}
                    stroke="black"
                    stroke-width="1"
                    stroke-dasharray="5,5"
                />
            {/if}
        </g>
        <g>
            {#each plot_data as line}
                <polyline
                    transition:fade={{ duration: 100 }}
                    points={line.points}
                    fill="none"
                    stroke="black"
                    style={`opacity: ${
                        !$stat_hovered || line.stat_code === $stat_hovered
                            ? 1
                            : 0.2
                    }`}
                    class="transition-opacity"
                />
            {/each}
        </g>
    </svg>
</div>
