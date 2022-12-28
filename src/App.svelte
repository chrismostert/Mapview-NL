<script>
  import NetherlandsMap from "./lib/components/NetherlandsMap.svelte";
  import CsvReader from "./lib/components/CsvReader.svelte";
  import VariableSelector from "./lib/components/selectors/VariableSelector.svelte";
  import LineChart from "./lib/components/LineChart.svelte";
  import { csv_name } from "./lib/store.js";
  import { fade } from "svelte/transition";

  let w_chart, h_chart;
</script>

<main class="flex flex-col h-screen w-screen">
  <div class="py-4 px-8 shadow-md flex justify-between">
    <h1 class="text-2xl">Mapview</h1>
    {#if $csv_name}
      <h1 transition:fade={{ duration: 100 }} class="text-2xl">{$csv_name}</h1>
    {/if}
  </div>

  <div class="w-full h-full grid grid-cols-12">
    <div class="pt-4 pl-8 col-span-3 shadow-md my-2 mx-1">
      <CsvReader />
      <VariableSelector />
    </div>

    <div class="col-span-5 p-4 shadow-md my-2 mx-1">
      <NetherlandsMap />
    </div>

    <div
      class="col-span-4 shadow-md my-2 mx-1"
      bind:clientWidth={w_chart}
      bind:clientHeight={h_chart}
    >
      <LineChart width={w_chart} height={h_chart} />
    </div>
  </div>
</main>
