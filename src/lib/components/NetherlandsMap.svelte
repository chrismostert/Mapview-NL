<script>
    import { geoPath } from "d3-geo";
    import rijksdriehoek from "../rijksdriehoek.js";
    import { onMount } from "svelte";

    const CENTER_COORDS = [5.38720621, 52.1551744];
    const SCALE_DENOM = 3.25e5;

    let json;
    let w = 0;
    let h = 0;

    let projection = rijksdriehoek().center(CENTER_COORDS);
    let data = [];

    onMount(async () => {
        const response = await fetch("/gemeente_gegeneraliseerd_2022.geojson");
        json = await response.json();
    });

    $: {
        projection = projection
            .scale(Math.min(w, h) / SCALE_DENOM)
            .translate([w / 2, h / 2]);

        const path = geoPath().projection(projection);

        if (json) {
            data = json.features.map((feat) => {
                return {
                    gem_code: feat.properties.statcode,
                    gem_name: feat.properties.statnaam,
                    geometry: path(feat),
                };
            });
            console.log(data);
        }
    }
</script>

<div class="w-full h-full" bind:clientWidth={w} bind:clientHeight={h}>
    <svg width="100%" height="100%" viewBox="0 0 {w} {h}">
        {#each data as gem}
            <path
                d={gem.geometry}
                class="fill-slate-300 hover:fill-slate-600 stroke-black stroke-1"
            />
        {/each}
    </svg>
</div>
