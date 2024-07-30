let index = (Bifrost) => {
    let dados = Bifrost.requestGet("/api/github/getlanguages");
    dados = JSON.parse(dados);
    carregaGraficoLinguagens(dados);
}

function carregaGraficoLinguagens(languages) {
    // Prepara os dados para o Chart.js
    var labels = Object.keys(languages);
    var data = Object.values(languages);

    // Configuração do gráfico
    var config = {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distribuição de Linguagens',
                data: data,
                backgroundColor: [
                    'rgba(127, 117, 248, 0.8)', // Cor para PHP
                    'rgba(255, 206, 86, 0.8)',  // Cor para JavaScript
                    'rgba(255, 99, 132, 0.8)',  // Cor para HTML
                    'rgba(75, 192, 192, 0.8)',  // Cor para CSS
                    'rgba(54, 162, 235, 0.8)',  // Cor para Dockerfile
                    'rgba(153, 102, 255, 0.8)'  // Cor para Shell
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.raw !== null) {
                                label += context.raw + '%';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    };

    // Renderiza o gráfico
    var ctx = document.getElementById('github-languages').getContext('2d');
    var myPieChart = new Chart(ctx, config);
}
