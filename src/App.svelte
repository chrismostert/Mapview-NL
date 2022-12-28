<script>
  import NetherlandsMap from "./lib/components/NetherlandsMap.svelte";
  import CsvReader from "./lib/components/CsvReader.svelte";
  import VariableSelector from "./lib/components/selectors/VariableSelector.svelte";
</script>

<main class="flex flex-col h-screen w-screen">
  <div class="py-4 px-8 shadow-md">
    <h1 class="text-2xl">Map viewer</h1>
  </div>

  <div class="w-full h-full grid grid-cols-12">
    <div class="pt-4 pl-8 col-span-3 shadow-md my-2 mx-1">
      <CsvReader />
      <VariableSelector />
    </div>

    <div class="col-span-5 p-4 shadow-md my-2 mx-1">
      <NetherlandsMap />
    </div>

    <div class="col-span-4 p-4 shadow-md my-2 mx-1">Linechart</div>
  </div>
</main>
