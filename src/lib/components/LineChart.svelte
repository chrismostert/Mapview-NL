<script>
	import { csv_data, selected_variable, selected_date, selected_date_idx } from '../store.js';
	import { scaleTime, scaleLinear } from 'd3-scale';
	import { stat_hovered } from '../store.js';
	import Tick from './Tick.svelte';
	import { fade } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	const CIRCLE_RADIUS = 2;

	let width = 0;
	let height = 0;

	const padding = {
		top: 50,
		left: 50,
		right: 50,
		bottom: 50
	};

	let chart_elem;

	let scale_x = scaleTime();
	let scale_y = scaleLinear();
	let date_x_pos = tweened(void 0, { duration: 150, easing: cubicOut });

	let filtered_data;
	let plot_data;

	let dates;

	let ticks_x = [];
	let ticks_y = [];

	let n_ticks_x;
	let n_ticks_y;

	function scale_data(filtered_data) {
		let plot_data_dict = {};

		for (let idx in filtered_data) {
			let { stat_code, date, value } = filtered_data[idx];

			if (!plot_data_dict[stat_code])
				plot_data_dict[stat_code] = {
					stat_code: stat_code,
					x: [],
					y: [],
					dates: new Set()
				};

			plot_data_dict[stat_code].x.push(scale_x(date));
			plot_data_dict[stat_code].y.push(scale_y(value));
			plot_data_dict[stat_code].dates.add(date);
		}

		ticks_x = scale_x.ticks(n_ticks_x);
		ticks_y = scale_y.ticks(n_ticks_y);
		return Object.values(plot_data_dict);
	}

	function handle_resize(width, height) {
		scale_x.range([padding.left, width - padding.right]);
		scale_y.nice(n_ticks_y).range([height - padding.bottom, padding.top]);

		plot_data = scale_data(filtered_data);
	}

	function update_data(selected_variable) {
		if (selected_variable) {
			filtered_data = Object.values($csv_data.data[selected_variable].data)
				.map((e) => e.data)
				.flat();

			scale_x.domain([$csv_data.extremes.min_x, $csv_data.extremes.max_x]);
			scale_y.domain([0, $csv_data.data[selected_variable].extremes.max_y]);
			handle_resize(width, height);
		}
	}

	function circle_path(r) {
		return `m${-r},0a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0m${r},0`;
	}

	function polyline_string(x, y) {
		let res = `M${x[0]},${y[0]}${circle_path(CIRCLE_RADIUS)}`;

		if (x.length > 1) {
			for (let i = 1; i < x.length; i++) {
				res += `L${x[i]},${y[i]}${circle_path(CIRCLE_RADIUS)}`;
			}
		}

		return res;
	}

	function handle_click(e) {
		if (dates) {
			const rect = chart_elem.getBoundingClientRect();
			const clicked_date = scale_x.invert(e.clientX - rect.left);

			const dists = dates.map((e) => Math.abs(clicked_date - e));
			let closest_date_idx = dists.indexOf(Math.min(...dists));

			$selected_date_idx = closest_date_idx;
		}
	}

	$: handle_resize(width, height);
	$: update_data($selected_variable);
	$: width, height, date_x_pos.set(scale_x($selected_date));
	$: dates = $csv_data?.ranges?.dates;

	// Dynamically adjust number of x ticks
	$: if (width >= 500) {
		n_ticks_x = 6;
	} else if (width >= 200) {
		n_ticks_x = 2;
	} else {
		n_ticks_x = 1;
	}

	// Adjust number of y ticks as well
	$: if (height >= 500) {
		n_ticks_y = 10;
	} else if (height >= 200) {
		n_ticks_y = 5;
	} else {
		n_ticks_y = 3;
	}
</script>

<div
	class="h-full w-full"
	bind:clientWidth={width}
	bind:clientHeight={height}
	bind:this={chart_elem}
>
	<svg width="100%" height="100%" on:click={handle_click} on:keydown>
		{#if $csv_data}
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
						direction={'horizontal'}
					/>
				{/each}
			</g>

			<!-- Date labels -->
			<g>
				{#each ticks_x as tick}
					<Tick
						x={scale_x(tick)}
						x_end={scale_x(tick)}
						y={height - padding.bottom}
						value={scale_x.tickFormat()(tick)}
						direction={'vertical'}
					/>
				{/each}
			</g>

			<!-- Data points -->
			<g>
				{#each plot_data as line (line.stat_code + $selected_variable)}
					<path
						d={polyline_string(line.x, line.y)}
						in:fade={{ duration: 100 }}
						style={`
                            color: ${
								(!$stat_hovered && line.dates.has($selected_date)) ||
								line.stat_code === $stat_hovered
									? 'black'
									: '#CCCCCC'
							};`}
						class="transition-color mix-blend-multiply"
						stroke="currentColor"
						fill="currentColor"
					/>
				{/each}
			</g>
		{/if}</svg
	>
</div>
