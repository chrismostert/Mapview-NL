<script>
    import { geoPath } from "d3-geo";
    import { interpolateRdYlBu } from "d3-scale-chromatic";
    import rijksdriehoek from "../rijksdriehoek.js";
    import { onMount } from "svelte";
    import { selected_data, min_value, max_value } from "../store.js";
    import tippy from "tippy.js";
    import "tippy.js/animations/scale-subtle.css";
    import "tippy.js/dist/tippy.css";

    let value_to_color = (value) => {
        let f = 1 - (value - $min_value) / ($max_value - $min_value);
        return interpolateRdYlBu($max_value == $min_value ? 0 : f);
    };

    // Constants
    const CENTER_COORDS = [5.38720621, 52.1551744];
    const SCALE_DENOM = 3.25e5;
    const NONE_COLOR = "#E0E0E0";

    // Dynamically bound variables
    let json;
    let w = 0;
    let h = 0;

    // Default projection and geodata container
    let projection = rijksdriehoek().center(CENTER_COORDS);
    let data = [];

    // Load the JSON
    onMount(async () => {
        const response = await fetch("/gemeente_gegeneraliseerd_2022.geojson");
        json = await response.json();
    });

    // When the width or height of parent container changes, recalculate projection
    $: {
        projection = projection
            .scale(Math.min(w, h) / SCALE_DENOM)
            .translate([w / 2, h / 2]);

        const path = geoPath().projection(projection);

        if (json) {
            data = json.features.map((feat) => {
                return {
                    stat_code: feat.properties.statcode,
                    stat_name: feat.properties.statnaam,
                    geometry: path(feat),
                };
            });
        }
    }

    // Set colors
    let colors = {};

    $: {
        console.log("Setting new colors...");
        const new_colors = {};

        for (const i in $selected_data) {
            let { stat_code, date, name, value } = $selected_data[i];
            new_colors[stat_code] = value_to_color(value);
        }

        colors = new_colors;
    }
</script>

<div class="w-full h-full" bind:clientWidth={w} bind:clientHeight={h}>
    <svg width="100%" height="100%">
        {#each data as stat}
            <path
                use:tippy={{
                    content: stat.stat_name,
                    animation: "scale-subtle",
                    arrow: true,
                }}
                d={stat.geometry}
                class="transition-all"
                style={`
                    fill: ${colors[stat.stat_code] || NONE_COLOR};
                    stroke: ${colors[stat.stat_code] ? "black" : NONE_COLOR};
                `}
            />
        {/each}
    </svg>
</div>
