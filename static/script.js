async function fetchData() {
    const response = await fetch("/prijzen");
    const data = await response.json();
    return data || [];
}

function drawChart(data) {
    if (data.length === 0) {
        alert("Geen prijsdata gevonden!");
        return;
    }

    const labels = data.map(entry => entry.datum_nl.split(" ")[1].slice(0, 5)); // HH:MM
    const prices = data.map(entry => entry.prijs_totaal);

    const pointBackgroundColors = prices.map(p => p < 0.10 ? 'green' : 'red');

    const ctx = document.getElementById('prijsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Prijs totaal incl. btw (€ per kWh)',
                data: prices,
                borderColor: 'blue',
                backgroundColor: 'rgba(0,0,0,0)',
                tension: 0.3,
                fill: false,
                pointRadius: 6,
                pointBackgroundColor: pointBackgroundColors,
                pointHoverRadius: 10
            }, {
                label: 'Gemiddelde prijs',
                data: Array(prices.length).fill(prices.reduce((a, b) => a + b, 0) / prices.length),
                borderColor: 'orange',
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.parsed.y.toFixed(4) + " €";
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: { display: true, text: 'Prijs (€ per kWh)' }
                },
                x: {
                    title: { display: true, text: 'Uur' }
                }
            }
        }
    });
}

async function init() {
    const data = await fetchData();
    drawChart(data);
}

init();
