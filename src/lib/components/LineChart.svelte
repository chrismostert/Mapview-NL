<script>
    import { csv_data, selected_variable, selected_date } from "../store.js";
    import { scaleTime, scaleLinear } from "d3-scale";
    import { stat_hovered } from "../store.js";
    import Tick from "./Tick.svelte";
    import { tooltip } from "../tooltip.js";
    import { draw, fade } from "svelte/transition";
    import { tweened } from "svelte/motion";
    import { quadInOut, cubicOut } from "svelte/easing";

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
    let date_x_pos = tweened(void 0, { duration: 150, easing: cubicOut });

    let min_x, min_y, max_x, max_y;
    let filtered_data;
    let plot_data;

    let ticks_x = [];
    let ticks_y = [];

    function scale_data(filtered_data) {
        let plot_data_dict = {};

        for (let idx in filtered_data) {
            let { stat_code, date, value } = filtered_data[idx];

            if (!plot_data_dict[stat_code])
                plot_data_dict[stat_code] = {
                    stat_code: stat_code,
                    x: [],
                    y: [],
                    dates: new Set(),
                };

            plot_data_dict[stat_code].x.push(scale_x(date));
            plot_data_dict[stat_code].y.push(scale_y(value));
            plot_data_dict[stat_code].dates.add(date);
        }

        ticks_x = scale_x.ticks(10);
        ticks_y = scale_y.ticks(10);
        return Object.values(plot_data_dict);
    }

    function handle_resize(width, height) {
        scale_x.range([padding.left, width - padding.right]);
        scale_y.nice(10).range([height - padding.bottom, padding.top]);

        plot_data = scale_data(filtered_data);
    }

    function update_data(selected_variable) {
        filtered_data = $csv_data?.data[selected_variable];

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
        handle_resize(width, height);
    }

    function polyline_string(x, y) {
        let points = [];
        for (let i in x) {
            points.push(`${x[i]},${y[i]}`);
        }
        return points.join(" ");
    }

    $: handle_resize(width, height);
    $: update_data($selected_variable);
    $: width, height, date_x_pos.set(scale_x($selected_date));
</script>

<div class="w-full h-full" bind:clientWidth={width} bind:clientHeight={height}>
    <svg width="100%" height="100%">
        <!-- Dateline -->
        <g>
            {#if $selected_date}
                <line
                    x1={$date_x_pos}
                    x2={$date_x_pos}
                    y1={padding.top}
                    y2={height - padding.bottom}
                    stroke="gray"
                    stroke-width="1"
                    stroke-dasharray="5,5"
                />
            {/if}
        </g>

        <!-- Horizontal grid lines -->
        <g>
            {#each ticks_y as tick}
                <Tick
                    x={padding.left}
                    x_end={width - padding.left - padding.right}
                    y={scale_y(tick)}
                    value={tick}
                    direction={"horizontal"}
                />
            {/each}
        </g>

        <!-- Data points -->
        <g>
            {#each plot_data as line (line.stat_code + $selected_variable)}
                <g
                    style={`
                    opacity: ${
                        (!$stat_hovered && line.dates.has($selected_date)) ||
                        line.stat_code === $stat_hovered
                            ? 1
                            : 0.2
                    };`}
                    class="transition-opacity"
                    stroke="black"
                >
                    <polyline
                        points={polyline_string(line.x, line.y)}
                        fill="none"
                        in:draw={{ duration: 250, easing: quadInOut }}
                    />
                    {#each line.x as x, i}
                        <circle
                            in:fade={{ duration: 100 }}
                            use:tooltip={{
                                content: `${line.stat_code}: ${Math.floor(
                                    scale_y.invert(line.y[i])
                                )}`,
                            }}
                            on:mouseleave={() => ($stat_hovered = void 0)}
                            on:mouseenter={() =>
                                ($stat_hovered = line.stat_code)}
                            cx={x}
                            cy={line.y[i]}
                            r="3"
                        />
                    {/each}
                </g>
            {/each}
        </g></svg
    >
</div>
