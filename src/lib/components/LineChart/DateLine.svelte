<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let x;
	export let y1;
	export let y2;

	let xpos = tweened(x, { duration: 150, easing: cubicOut });
	$: xpos.set(x);
</script>

{#if $xpos}
	<line x1={$xpos} x2={$xpos} {y1} {y2} stroke="gray" stroke-width="1" stroke-dasharray="5,5" />
{/if}
