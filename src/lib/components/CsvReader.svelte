<script>
    import { csv_data, csv_name } from "../store";
    import { onMount } from "svelte";

    let worker;
    let error_msg;

    const EXPECTED_FIELDS = JSON.stringify([
        "stat_code",
        "date",
        "name",
        "value",
    ]);

    const onWorkerMessage = (msg) => {
        if (msg.data.error) {
            error_msg = msg.data.error.message;
        } else if (msg.data.result) {
            $csv_data = msg.data.result;
        }
    };

    onMount(async () => {
        const worker_import = await import("../loader.worker?worker");
        worker = new worker_import.default();
        worker.onmessage = onWorkerMessage;
    });
</script>

{#if !$csv_data}
    <input
        type="file"
        accept=".csv"
        on:change={async (e) => {
            $csv_name = e.target.files[0].name;
            worker.postMessage({
                file: e.target.files[0],
                expected_fields: EXPECTED_FIELDS,
            });
        }}
    />
{/if}

{#if error_msg}
    <p class="text-red-600">{JSON.stringify(error_msg)}</p>
{/if}
