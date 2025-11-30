fetch("/prijzen")
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('prijsChart').getContext('2d');

        const gemiddelde = data.gemiddelde;
        const kleuren = data.prijzen.map(p => p > gemiddelde ? 'red' : 'green');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Kwartiersprijs',
                        data: data.prijzen,
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0,0,255,0.1)',
                        fill: true,
                        pointBackgroundColor: kleuren,
                        pointRadius: 5,
                        tension: 0.2
                    },
                    {
                        label: 'Gemiddelde',
                        data: Array(data.prijzen.length).fill(gemiddelde),
                        borderColor: 'orange',
                        borderDash: [10, 5],
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: { display: true, text: 'Tijd' }
                    },
                    y: {
                        display: true,
                        title: { display: true, text: 'Prijs (€)' }
                    }
                }
            }
        });
    });
