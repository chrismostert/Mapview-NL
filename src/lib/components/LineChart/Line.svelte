<script>
	export let x;
	export let y;
	export let color;
	export let circle_radius = 2;
	import { fade } from 'svelte/transition';

	function circle_path(r) {
		return `m${-r},0a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0m${r},0`;
	}

	function polyline_string(x, y) {
		let res = `M${x[0]},${y[0]}${circle_path(circle_radius)}`;

		if (x.length > 1) {
			for (let i = 1; i < x.length; i++) {
				res += `L${x[i]},${y[i]}${circle_path(circle_radius)}`;
			}
		}

		return res;
	}
</script>

<path
	d={polyline_string(x, y)}
	in:fade={{ duration: 100 }}
	class="transition-color"
	style={`color: ${color}`}
	stroke="currentColor"
	fill="currentColor"
/>
