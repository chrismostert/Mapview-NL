import Papa from "papaparse";

function parse_csv(file, expected_fields) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    return reject(results.errors);
                }
                if (
                    JSON.stringify(results.meta.fields) != expected_fields
                ) {
                    return reject(
                        `Invalid fields in csv file! Expected ${expected_fields} but got ${JSON.stringify(
                            results.meta.fields
                        )}`
                    );
                }

                // Parse dates
                let data = results.data.map((elem) => {
                    let parsed_date = Date.parse(elem.date);
                    if (isNaN(parsed_date)) {
                        return reject(`Invalid date ${elem.date} found`);
                    }
                    elem.date = parsed_date;
                    return elem;
                });

                // Sort by date
                data.sort((a, b) => a.date - b.date);

                return resolve(data);
            },
            error: (error) => {
                return reject(error);
            },
        });
    });
};

function calculate_ranges(data) {
    const unique_variables = new Set();
    const dates = new Set();

    for (const i in data) {
        unique_variables.add(data[i].name);
        dates.add(data[i].date);
    }

    return {
        variables: [...unique_variables],
        dates: [...dates],
    }
}

onmessage = async (msg) => {
    // Load csv file
    if (msg.data.file) {
        try {
            console.log("Reading csv file in worker...");
            let data = await parse_csv(msg.data.file, msg.data.expected_fields);
            let ranges = calculate_ranges(data);
            postMessage({
                result: {
                    data,
                    ranges
                }
            });
        } catch (e) {
            postMessage({ error: e });
        }
    }
}