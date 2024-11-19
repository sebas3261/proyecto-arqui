// Configurar el gráfico
function createChart(ctx, config) {
    return new Chart(ctx, config);
}

// Función para obtener datos de la API
fetch('https://api-micro.vercel.app/colors')
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos:', data);

        // Preparar datos para los gráficos
        const timestamps = data.map(d => new Date(d.timestamp).toLocaleString());
        const ranges = data.map(d => parseInt(d.range)); // Extraer valores numéricos de "range"
        const potables = data.filter(d => d.potable).length;
        const noPotables = data.length - potables;

        const colors = data.map(d => `rgb(${d.color.join(",")})`);
        const labels = data.map((_, i) => `Muestra ${i + 1}`);

        // Gráfico 1: Concentraciones en el tiempo
        createChart(document.getElementById('chart1'), {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Concentración (ppm)',
                    data: ranges,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: true } },
                scales: {
                    x: { title: { display: true, text: 'Tiempo' } },
                    y: { title: { display: true, text: 'Concentración (ppm)' } }
                }
            }
        });

        // Gráfico 2: Distribución de potabilidad
        createChart(document.getElementById('chart2'), {
            type: 'pie',
            data: {
                labels: ['Potable', 'No Potable'],
                datasets: [{
                    label: 'Distribución',
                    data: [potables, noPotables],
                    backgroundColor: ['green', 'red'],
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: true } }
            }
        });

        // Gráfico 3: Colores de las muestras
        createChart(document.getElementById('chart3'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Colores',
                    data: ranges,
                    backgroundColor: colors,
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { title: { display: true, text: 'Muestras' } },
                    y: { title: { display: true, text: 'Concentración (ppm)' } }
                }
            }
        });

        // Funcionalidad para cambiar entre gráficos
        const charts = document.querySelectorAll('.chart');
        const buttons = document.querySelectorAll('nav button');

        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // Primero ocultamos todos los gráficos
                charts.forEach(chart => chart.style.display = 'none');
                // Luego mostramos el gráfico correspondiente
                charts[index].style.display = 'block';
            });
        });
    })
    .catch(error => console.error('Error al obtener los datos:', error));
