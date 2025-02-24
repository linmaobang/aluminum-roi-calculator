class ROIChartRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.chart = null;
    }

    initRadarChart(data) {
        const config = {
            type: 'radar',
            data: {
                labels: [
                    'OEE提升收益',
                    '质量改善收益',
                    '人工效率收益',
                    '换膜时间收益'
                ],
                datasets: [{
                    label: '预期收益(万元/年)',
                    data: [
                        data.oeeBenefit.mesContribution,
                        data.qualityBenefit.mesContribution,
                        data.laborSaving.mesContribution,
                        data.moldChangeSaving.mesContribution
                    ],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointHoverBackgroundColor: '#fff'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 0,
                        max: Math.max(
                            data.oeeBenefit.mesContribution,
                            data.qualityBenefit.mesContribution,
                            data.laborSaving.mesContribution,
                            data.moldChangeSaving.mesContribution
                        ) * 1.2,
                        ticks: {
                            stepSize: 50
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}万元/年`;
                            }
                        }
                    }
                }
            }
        };

        this.chart = new Chart(this.ctx, config);
    }

    updateChart(data) {
        if (this.chart) {
            this.chart.data.datasets[0].data = [
                data.oeeBenefit.mesContribution,
                data.qualityBenefit.mesContribution,
                data.laborSaving.mesContribution,
                data.moldChangeSaving.mesContribution
            ];
            this.chart.update();
        }
    }
} 