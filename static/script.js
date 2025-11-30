async function fetchData() {
    const response = await fetch("/prijzen");
    const data = await response.json();

    // Bereken prijs totaal volgens de nieuwe formule
    const prijzen = data.map(d => {
        const prijs_excl = parseFloat(d.prijs_excl_belastingen.replace(',', '.'));
        return (prijs_excl + 0.0220 + 0.1015) * 1.21;
    });

    const labels = data.map(d => d.datum_nl);

    // Gemiddelde berekenen
    const gemiddelde = prijzen.reduce((a, b) => a + b, 0) / prijzen.length;

    // Kleuren voor kwartierspunten bepalen
    const pointColors = prijzen.map(p => p > gemiddelde ? 'red' : 'green');

    const ctx = document.getElementById('prijsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Prijs per kwartier',
                    data: prijzen,
                    borderColor: 'blue',
                    backgroundColor: 'transparent', // geen vulling
                    fill: false,
                    pointBackgroundColor: pointColors,
                    tension: 0.1
                },
                {
                    label: 'Gemiddelde',
                    data: Array(prijzen.length).fill(gemiddelde),
                    borderColor: 'orange',
                    borderDash: [5, 5], // gebroken lijn
                    fill: false,
                    pointRadius: 0 // geen punten voor gemiddelde lijn
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Prijs (€)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tijd'
                    }
                }
            }
        }
    });
}

fetchData();
