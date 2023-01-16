<script>
	export let x;
	export let x_end;
	export let y;
	export let value;
	export let direction;
</script>

<g transform={`translate(${x}, ${y})`}>
	<text
		x={direction === 'horizontal' ? -10 : 20}
		y={direction === 'horizontal' ? 0 : 20}
		font-size="13px"
		text-anchor={direction === 'horizontal' ? 'end' : 'middle'}
		alignment-baseline="middle"
	>
		{value}
	</text>
	{#if direction === 'horizontal'}
		<line x1={0} x2={x_end} y1={0} y2={0} stroke="#e6e6e6" stroke-width="1" />
	{:else}
		<line x1={0} x2={0} y1={2} y2={8} stroke="black" stroke-width="1" />
	{/if}
</g>
