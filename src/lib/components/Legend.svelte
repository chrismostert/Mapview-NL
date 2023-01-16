<script>
	export let ramp_string, min_value, max_value;

	let midpoint;
	$: midpoint = (Number(min_value) + Number(max_value)) / 2;
</script>

<div class="relative h-full w-full">
	<div
		class="h-1/2 border border-gray-500"
		style={`
    background: linear-gradient(
        to right,
        ${ramp_string}
    )
`}
	/>
	<div class="flex justify-between">
		<div>
			{min_value !== max_value && isFinite(min_value) ? min_value : ''}
		</div>
		<div>
			{isFinite(midpoint) ? midpoint : ''}
		</div>
		<div>
			{max_value !== min_value && isFinite(max_value) ? max_value : ''}
		</div>
	</div>
</div>
