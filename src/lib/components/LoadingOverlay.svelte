<script>
	import { onMount } from 'svelte';
	import { Circle } from 'svelte-loading-spinners';
	import { ACCENT_COLOR } from '$lib/theme.js';
	export let message;

	let opacity = 0;
	onMount(() => {
		setTimeout(() => (opacity = 0.7), 200);
	});
</script>

<div class="absolute z-10 h-full w-full bg-black transition-opacity" style={`opacity: ${opacity}`}>
	<div class="flex h-full w-full items-center justify-center">
		<div class="flex flex-col items-center text-white">
			<div>
				<Circle color={ACCENT_COLOR} />
			</div>
			{#if message}
				<div class="mt-2">
					{message}
				</div>
			{/if}
		</div>
	</div>
</div>
