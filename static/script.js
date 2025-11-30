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

    const labels = data.map(e => e.datum_nl.split(" ")[1].slice(0, 5));
    const prices = data.map(e => e.prijs_incl_btw);

    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

    const pointColors = prices.map(p => p > avg ? "red" : "green");

    const ctx = document.getElementById('prijsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Prijs incl. btw (€ per kWh)',
                data: prices,
                borderColor: 'blue',
                backgroundColor: 'rgba(0,0,0,0)',
                tension: 0.3,
                fill: false,
                pointRadius: 6,
                pointBackgroundColor: pointColors
            },
            {
                label: 'Gemiddelde prijs',
                data: Array(prices.length).fill(avg),
                borderColor: 'orange',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true
        }
    });
}

async function init() {
    const data = await fetchData();
    drawChart(data);
}

init();
