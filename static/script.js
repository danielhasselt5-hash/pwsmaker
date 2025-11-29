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

    // Labels (tijdstippen)
    const labels = data.map(entry => entry.datum_nl.split(" ")[1].slice(0, 5)); // HH:MM

    // Prijzen totaal incl. btw
    const prices = data.map(entry => entry.prijs_totaal);

    // Gemiddelde prijs
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Puntkleuren: rood boven gemiddelde, groen onder
    const pointBackgroundColors = prices.map(p => p > avgPrice ? 'red' : 'green');

    const ctx = document.getElementById('prijsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Prijs totaal incl. btw (€ per kWh)',
                    data: prices,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0,0,0,0)', // geen body kleur
                    tension: 0.3,
                    fill: false, // body niet invullen
                    pointRadius: 6,
                    pointBackgroundColor: pointBackgroundColors
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
