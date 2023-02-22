<script>
	import NetherlandsMap from '$lib/components/NetherlandsMap.svelte';
	import CsvReader from '$lib/components/CsvReader.svelte';
	import VariableSelector from '$lib/components/VariableSelector.svelte';
	import LineChart from '$lib/components/LineChart/LineChart.svelte';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';
	import { csv_name, loading_message } from '$lib/store.js';
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Mapview NL</title>
</svelte:head>

<main>
	{#if $loading_message}
		<LoadingOverlay message={$loading_message} />
	{/if}

	<div class="flex h-screen w-screen flex-col">
		<div class="flex justify-between py-4 px-8 shadow-md">
			<h1 class="text-2xl">Mapview NL</h1>
			{#if $csv_name}
				<h1 transition:fade={{ duration: 100 }} class="text-2xl">{$csv_name}</h1>
			{/if}
		</div>

		<div class="grid h-full w-full grid-cols-12">
			<div class="col-span-3 my-2 mx-1 pt-4 pl-8 shadow-md">
				<CsvReader />
				<VariableSelector />
			</div>

			<div class="col-span-5 my-2 mx-1 shadow-md">
				<NetherlandsMap />
			</div>

			<div class="col-span-4 my-2 mx-1 shadow-md">
				<LineChart />
			</div>
		</div>
	</div>
</main>
