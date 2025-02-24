document.addEventListener('DOMContentLoaded', function() {
    // 获取画布上下文
    const ctx = document.getElementById('radarChart').getContext('2d');
    const chartRenderer = new ROIChartRenderer(ctx);
    
    // 获取所有输入元素
    const inputs = {
        annualOutput: document.getElementById('annualOutput'),
        currentOEE: document.getElementById('currentOEE'),
        aluminumConsumption: document.getElementById('aluminumConsumption'),
        defectRate: document.getElementById('defectRate'),
        laborCost: document.getElementById('laborCost'),
        oeeAdjust: document.getElementById('oeeAdjust'),
        defectAdjust: document.getElementById('defectAdjust'),
        laborAdjust: document.getElementById('laborAdjust'),
        moldChangeAdjust: document.getElementById('moldChangeAdjust'),
        oeeContribution: document.getElementById('oeeContribution'),
        defectContribution: document.getElementById('defectContribution'),
        laborContribution: document.getElementById('laborContribution'),
        moldChangeContribution: document.getElementById('moldChangeContribution')
    };

    // 获取关键指标容器
    const keyMetricsContainer = document.getElementById('keyMetrics');

    // 创建防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 更新调整值显示
    function updateAdjustmentDisplay(id, value, isNegative = false) {
        const display = document.getElementById(id + 'Value');
        display.textContent = `${isNegative ? '-' : '+'}${value}%`;
    }

    // 更新显示
    function updateDisplay() {
        try {
            // 显示计算中状态
            document.getElementById('calculateBtn').classList.add('opacity-50', 'cursor-wait');
            
            // 收集当前参数
            const params = {
                annualOutput: parseFloat(inputs.annualOutput.value),
                currentOEE: parseFloat(inputs.currentOEE.value),
                aluminumConsumption: parseFloat(inputs.aluminumConsumption.value),
                defectRate: parseFloat(inputs.defectRate.value),
                laborCost: parseFloat(inputs.laborCost.value),
                improvements: {
                    oee: parseFloat(inputs.oeeAdjust.value),
                    defect: parseFloat(inputs.defectAdjust.value),
                    labor: parseFloat(inputs.laborAdjust.value),
                    moldChange: parseFloat(inputs.moldChangeAdjust.value)
                },
                contributions: {
                    oee: parseFloat(inputs.oeeContribution.value),
                    defect: parseFloat(inputs.defectContribution.value),
                    labor: parseFloat(inputs.laborContribution.value),
                    moldChange: parseFloat(inputs.moldChangeContribution.value)
                }
            };

            // 计算收益
            const calculator = new ROICalculator(params);
            const benefits = calculator.getTotalBenefit();

            // 更新雷达图
            chartRenderer.updateChart(benefits);

            // 更新关键指标
            updateKeyMetrics(benefits);
            
            // 恢复按钮状态
            document.getElementById('calculateBtn').classList.remove('opacity-50', 'cursor-wait');

        } catch (error) {
            console.error('计算错误:', error);
            // 显示错误提示
            alert('计算出错: ' + error.message);
            // 恢复按钮状态
            document.getElementById('calculateBtn').classList.remove('opacity-50', 'cursor-wait');
        }
    }

    // 更新关键指标显示
    function updateKeyMetrics(benefits) {
        const metrics = [
            { 
                label: 'MES总收益', 
                value: `${benefits.mesTotal}万元`
            },
            { 
                label: 'OEE提升收益', 
                value: `${benefits.oeeBenefit.mesContribution}万元`
            },
            { 
                label: '质量改善收益', 
                value: `${benefits.qualityBenefit.mesContribution}万元`
            },
            { 
                label: '人工效率收益', 
                value: `${benefits.laborSaving.mesContribution}万元`
            },
            { 
                label: '换膜时间收益', 
                value: `${benefits.moldChangeSaving.mesContribution}万元`
            }
        ];

        keyMetricsContainer.innerHTML = metrics.map(metric => `
            <div class="p-4 bg-gray-50 rounded-lg">
                <div class="text-sm text-gray-600">${metric.label}</div>
                <div class="text-xl font-semibold text-blue-600">${metric.value}</div>
            </div>
        `).join('');
    }

    // 初始化图表后立即更新一次显示
    const initialParams = {
        annualOutput: 2,
        currentOEE: 65,
        aluminumConsumption: 2200,
        defectRate: 4,
        laborCost: 300,
        improvements: {
            oee: 5,
            defect: 1,
            labor: 10,
            moldChange: 20
        },
        contributions: {
            oee: 70,      // OEE提升MES贡献度
            defect: 80,   // 质量改善MES贡献度
            labor: 50,    // 人工效率MES贡献度
            moldChange: 60 // 换膜时间MES贡献度
        }
    };
    const calculator = new ROICalculator(initialParams);
    const initialBenefits = calculator.getTotalBenefit();
    chartRenderer.initRadarChart(initialBenefits);
    updateKeyMetrics(initialBenefits);

    // 添加滑块事件监听
    inputs.oeeAdjust.addEventListener('input', function() {
        updateAdjustmentDisplay('oeeAdjust', this.value, false);
    });

    inputs.defectAdjust.addEventListener('input', function() {
        updateAdjustmentDisplay('defectAdjust', this.value, true);
    });

    inputs.laborAdjust.addEventListener('input', function() {
        updateAdjustmentDisplay('laborAdjust', this.value, false);
    });

    inputs.moldChangeAdjust.addEventListener('input', function() {
        updateAdjustmentDisplay('moldChangeAdjust', this.value, true);
    });

    inputs.oeeContribution.addEventListener('input', function() {
        updateAdjustmentDisplay('oeeContribution', this.value, false);
    });

    inputs.defectContribution.addEventListener('input', function() {
        updateAdjustmentDisplay('defectContribution', this.value, false);
    });

    inputs.laborContribution.addEventListener('input', function() {
        updateAdjustmentDisplay('laborContribution', this.value, false);
    });

    inputs.moldChangeContribution.addEventListener('input', function() {
        updateAdjustmentDisplay('moldChangeContribution', this.value, false);
    });

    // 添加计算按钮事件监听
    document.getElementById('calculateBtn').addEventListener('click', updateDisplay);
}); 