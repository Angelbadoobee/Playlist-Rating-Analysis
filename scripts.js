document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-input");

    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const contents = e.target.result;
                const data = parseCSV(contents);
                const raceData = getRaceData(data);
                const genderData = getGenderData(data);

                renderCharts(raceData, genderData);
            };

            reader.readAsText(file);
        }
    });

    // Parse CSV data into an array of objects
    function parseCSV(contents) {
        const lines = contents.split("\n").map(line => line.trim()).filter(line => line.length > 0);
        const headers = lines[0].split(","); // Extract headers
        const rows = lines.slice(1); // Data rows

        return rows.map(row => {
            const values = row.split(",");
            let rowData = {};
            headers.forEach((header, index) => {
                rowData[header.trim()] = values[index] ? values[index].trim() : "";
            });
            return rowData;
        });
    }

    // Process data to calculate average ratings by race
    function getRaceData(data) {
        const raceRatings = {};

        data.forEach(row => {
            const race = row["Race of Artist(s)"];
            const rating = parseFloat(row["Rating"]);

            if (rating && race) {
                if (!raceRatings[race]) {
                    raceRatings[race] = [];
                }
                raceRatings[race].push(rating);
            }
        });

        // Calculate average rating for each race
        const raceAvgRatings = {};
        for (const race in raceRatings) {
            const ratings = raceRatings[race];
            const avgRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
            raceAvgRatings[race] = avgRating;
        }

        return raceAvgRatings;
    }

    // Process data to calculate average ratings by gender
    function getGenderData(data) {
        const genderRatings = {};

        data.forEach(row => {
            const gender = row["Gender of Artist(s)"];
            const rating = parseFloat(row["Rating"]);

            if (rating && gender) {
                if (!genderRatings[gender]) {
                    genderRatings[gender] = [];
                }
                genderRatings[gender].push(rating);
            }
        });

        // Calculate average rating for each gender
        const genderAvgRatings = {};
        for (const gender in genderRatings) {
            const ratings = genderRatings[gender];
            const avgRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
            genderAvgRatings[gender] = avgRating;
        }

        return genderAvgRatings;
    }

    // Render the charts using Chart.js
    function renderCharts(raceData, genderData) {
        const ctxRace = document.getElementById("race-chart").getContext("2d");
        const ctxGender = document.getElementById("gender-chart").getContext("2d");

        // Bar chart for race data
        new Chart(ctxRace, {
            type: "bar",
            data: {
                labels: Object.keys(raceData),
                datasets: [{
                    label: "Average Rating by Race",
                    data: Object.values(raceData),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Bar chart for gender data
        new Chart(ctxGender, {
            type: "bar",
            data: {
                labels: Object.keys(genderData),
                datasets: [{
                    label: "Average Rating by Gender",
                    data: Object.values(genderData),
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
