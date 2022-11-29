<script>
  import NetherlandsMap from "./lib/components/NetherlandsMap.svelte";
</script>

<main class="flex flex-col h-screen w-screen">
  <div class="py-4 px-8 shadow-md">
    <h1 class="text-2xl">Title</h1>
  </div>

  <div class="w-full h-full grid grid-cols-12">
    <div class="pt-4 pl-8 col-span-2 shadow-md">
      <h1 class="text-xl">Options</h1>
    </div>

    <div class="col-span-10 p-4">
      <NetherlandsMap />
    </div>
  </div>
</main>
