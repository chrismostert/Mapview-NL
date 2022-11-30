<script>
    import { csv_data } from "../store";
    import Papa from "papaparse";

    const parse_csv = (file) => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    console.log(results);
                    return resolve(results);
                },
                error: (error) => {
                    return reject(error);
                },
            });
        });
    };
</script>

<input
    type="file"
    accept=".csv"
    on:change={async (e) => ($csv_data = await parse_csv(e.target.files[0]))}
/>
