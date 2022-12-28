<script>
    import { csv_data, selected_variable } from "../store.js";
    import { scaleTime, scaleLinear } from "d3-scale";
    export let width;
    export let height;

    const padding = {
        top: 50,
        left: 50,
        right: 50,
        bottom: 50,
    };

    let scale_x = scaleTime();
    let scale_y = scaleLinear();

    let min_x, min_y, max_x, max_y;
    let plot_data;

    function update_data(selected_variable) {
        let filtered_data = $csv_data?.filter(
            (d) => d.name === selected_variable
        );

        let xvals = filtered_data?.map((d) => d.date);
        let yvals = filtered_data?.map((d) => d.value);

        if (xvals && yvals) {
            min_x = Math.min(...xvals);
            min_y = Math.min(...yvals);
            max_x = Math.max(...xvals);
            max_y = Math.max(...yvals);
        }

        scale_x
            .domain([min_x, max_x])
            .range([padding.left, width - padding.right]);
        scale_y
            .domain([0, max_y])
            .range([height - padding.bottom, padding.top]);

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

        plot_data = Object.values(plot_data_dict);
    }

    $: update_data($selected_variable);
</script>

<svg {width} {height}>
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
    </g>
    <g>
        {#each plot_data as line}
            <polyline points={line.points} fill="none" stroke="black"/>
        {/each}
    </g>
</svg>
