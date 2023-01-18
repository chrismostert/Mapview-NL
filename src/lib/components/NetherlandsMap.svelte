<script>
	import { geoPath } from 'd3-geo';
	import { scaleSequential } from 'd3-scale';
	import { interpolateBlues } from 'd3-scale-chromatic';
	import rijksdriehoek from '../rijksdriehoek.js';
	import Legend from './Legend.svelte';
	import { onMount } from 'svelte';
	import { csv_data, selected_variable, selected_date, stat_hovered } from '../store.js';
	import { tooltip } from '../tooltip.js';
	import { fade } from 'svelte/transition';
	import { feature as topojson_feature } from 'topojson-client';

	// Constants
	const CENTER_COORDS = [5.38720621, 52.1551744];
	const SCALE_DENOM = 3.25e5;
	const NONE_COLOR = '#E0E0E0';
	const RAMP_FUN = interpolateBlues;
	const GRADIENT_STEPS = 7;

	// Dynamically bound variables
	let maps_year = {};
	let loaded_year;
	let json;
	let w = 0;
	let h = 0;
	let scale = scaleSequential().interpolator(RAMP_FUN);
	let colors = {};
	let values = {};
	let max;
	let n_datapoints = 0;

	// Default projection and geodata container
	let projection = rijksdriehoek().center(CENTER_COORDS);
	let data = [];

	// Calculate stops for legend gradient
	const ramp_string = Array(GRADIENT_STEPS + 1)
		.fill()
		.map((_, idx) => RAMP_FUN(idx / GRADIENT_STEPS))
		.join(',');

	// Load the JSON
	onMount(async () => {
		const pattern = /gemeente_gegeneraliseerd_(\d{4})/;

		const response = await fetch('gemeente_gegeneraliseerd.topojson');
		const topo = await response.json();
		const years = Object.keys(topo.objects).map((name) => Number(name.match(pattern)[1]));

		for (const year of years) {
			maps_year[year] = topojson_feature(topo, `gemeente_gegeneraliseerd_${year}`);
		}

		loaded_year = years[years.length - 1];
		json = maps_year[loaded_year];
	});

	// When the width or height of parent container changes, recalculate projection
	$: {
		projection = projection.scale(Math.min(w, h) / SCALE_DENOM).translate([w / 2, h / 2]);

		const path = geoPath().projection(projection);

		if (json) {
			data = json.features.map((feat) => {
				return {
					stat_code: feat.properties.statcode,
					stat_name: feat.properties.statnaam,
					geometry: path(feat)
				};
			});
		}
	}

	function calculate_colors(selected_variable, selected_date) {
		if (selected_variable && selected_date) {
			const selected_data = $csv_data.data[selected_variable]?.data[selected_date]?.data;
			n_datapoints = selected_data?.length;

			const new_colors = {};
			const new_values = {};

			max = $csv_data.data[selected_variable].data[selected_date]?.extremes.max_y;
			scale.domain([0, max]);

			for (const i in selected_data) {
				let { stat_code, value } = selected_data[i];
				new_colors[stat_code] = scale(value);
				new_values[stat_code] = value;
			}

			colors = new_colors;
			values = new_values;
		}
	}

	// When date range changes year, we have to draw a different map
	$: if ($selected_date && new Date($selected_date).getFullYear() != loaded_year) {
		// Clamp year to available maps
		let n_years = Object.keys(maps_year).length;
		let new_year = Math.min(
			Math.max(new Date($selected_date).getFullYear(), Object.keys(maps_year)[0]),
			Object.keys(maps_year)[n_years - 1]
		);

		json = maps_year[new_year];
		loaded_year = new_year;
	}

	$: calculate_colors($selected_variable, $selected_date);
</script>

<div class="h-[90%] w-full" bind:clientWidth={w} bind:clientHeight={h}>
	<svg width="100%" height="100%">
		<!-- Fully opaque backbround rect acts as a hitbox for when the mouse leaves a municipality -->
		<rect
			class="opacity-0"
			width="100%"
			height="100%"
			on:mouseenter={() => ($stat_hovered = void 0)}
		/>

		{#each data as stat (stat.stat_code)}
			<path
				on:mouseenter={() => ($stat_hovered = stat.stat_code)}
				use:tooltip={{
					content: `${stat.stat_name}: ${values[stat.stat_code] || 'No data'}`
				}}
				d={stat.geometry}
				class="transition"
				style={`
                    fill: ${colors[stat.stat_code] || NONE_COLOR};
                    stroke: ${
						stat.stat_code === $stat_hovered
							? 'black'
							: colors[stat.stat_code] || NONE_COLOR
					};
                    opacity: ${!$stat_hovered || stat.stat_code === $stat_hovered ? 1 : 0.4};
                `}
			/>
		{/each}
	</svg>
</div>
<div class="h-[10%]">
	{#if n_datapoints > 0}
		<div class="flex w-full justify-center" transition:fade={{ duration: 100 }}>
			<div class="w-1/2">
				<Legend {ramp_string} min_value="0" max_value={max} />
			</div>
		</div>
	{/if}
</div>
