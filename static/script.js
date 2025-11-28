async function fetchData() {
    const response = await fetch("/prijzen");
    const data = await response.json();
    return Array.isArray(data) ? data : [];
}

function drawChart(data) {
    if (data.length === 0) {
        alert("Geen prijsdata gevonden!");
        return;
    }

    // Labels en prijzen per kwartier
    const labels = data.map(entry => entry.datum_nl.split(" ")[1].slice(0, 5));
    const prices = data.map(entry => parseFloat(entry.prijs_excl_belastingen.replace(",", ".")));

    // Gemiddelde berekenen
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    const ctx = document.getElementById('prijsChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Prijs (€ per kWh)',
                    data: prices,
                    borderColor: 'blue',
                    backgroundColor: prices.map(p => p < avgPrice ? 'rgba(0,255,0,0.3)' : 'rgba(255,0,0,0.3)'),
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3
                },
                {
                    label: 'Gemiddelde prijs',
                    data: Array(prices.length).fill(avgPrice),
                    borderColor: 'orange',
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
