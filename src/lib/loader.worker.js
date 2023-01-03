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

                // Parse dates and numbers
                let data = results.data.map((elem) => {
                    let parsed_date = Date.parse(elem.date);
                    if (isNaN(parsed_date)) {
                        return reject(`Invalid date ${elem.date} found`);
                    }

                    let parsed_value = Number(elem.value);
                    if (isNaN(parsed_value)) {
                        return reject(`Non-numeric value ${elem.value} found`);
                    }

                    elem.date = parsed_date;
                    elem.value = parsed_value;

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

function get_extremes(data) {
    let min_x = Infinity;
    let min_y = Infinity;
    let max_x = 0;
    let max_y = 0;

    for (let i in data) {
        let x = data[i].date;
        let y = data[i].value;

        if (x > max_x) { max_x = x }
        if (y > max_y) { max_y = y }
        if (x < min_x) { min_x = x }
        if (y < min_y) { min_y = y }
    }

    return {
        min_x, min_y, max_x, max_y
    }

}

function group_data(data) {
    let grouped = {}

    for (let row of data) {
        // Variable level
        if (!grouped[row.name]) {
            grouped[row.name] = {
                data: {}
            };
        }

        // Date level
        if (!grouped[row.name].data[row.date]) {
            grouped[row.name].data[row.date] = {
                data: []
            };
        }

        grouped[row.name].data[row.date].data.push(row);
    }

    for (let variable of Object.keys(grouped)) {
        let rows = Object.values(grouped[variable].data).map(e => e.data).flat();
        grouped[variable].extremes = get_extremes(rows);
        for (let date of Object.keys(grouped[variable].data)) {
            grouped[variable].data[date].extremes = get_extremes(grouped[variable].data[date].data);
        }
    }

    console.log(grouped);

    return grouped;
}

onmessage = async (msg) => {
    // Load csv file
    if (msg.data.file) {
        try {
            console.log("Reading csv file in worker...");
            let raw_data = await parse_csv(msg.data.file, msg.data.expected_fields);
            let ranges = calculate_ranges(raw_data);
            let extremes = get_extremes(raw_data);
            let data = group_data(raw_data);

            postMessage({
                result: {
                    data,
                    ranges,
                    extremes
                }
            });
        } catch (e) {
            postMessage({ error: e });
        }
    }
}