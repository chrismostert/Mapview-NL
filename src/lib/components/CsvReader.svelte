<script>
    import { csv_data } from "../store";
    import Papa from "papaparse";

    const EXPECTED_FIELDS = JSON.stringify([
        "stat_code",
        "date",
        "name",
        "value",
    ]);

    let error_msg;

    const parse_csv = (file) => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    console.log(results);
                    if (results.errors.length > 0) {
                        return reject(results.errors);
                    }
                    if (
                        JSON.stringify(results.meta.fields) != EXPECTED_FIELDS
                    ) {
                        return reject(
                            `Invalid fields in csv file! Expected ${EXPECTED_FIELDS} but got ${JSON.stringify(
                                results.meta.fields
                            )}`
                        );
                    }

                    error_msg = void 0;
                    return resolve(results);
                },
                error: (error) => {
                    return reject(error);
                },
            });
        });
    };
</script>

{#if !$csv_data}
    <input
        type="file"
        accept=".csv"
        on:change={async (e) => {
            try {
                let data = await parse_csv(e.target.files[0]);
                $csv_data = data;
            } catch (e) {
                error_msg = e;
            }
        }}
    />
{/if}

{#if error_msg}
<p class="text-red-600">{JSON.stringify(error_msg)}</p>
{/if}
