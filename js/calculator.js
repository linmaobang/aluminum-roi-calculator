// 行业基准数据
const INDUSTRY_BASELINE = {
    oee: 65,
    defectRate: 4,
    wipDays: 20,
    meltLossFactor: 1.08,
    laborCostPerHour: 30,    // 人工成本（元/小时）
    energyCostPerTon: 800,   // 能耗成本（元/吨）
    moldCostAverage: 100000  // 模具平均成本（元/副）
};

class ROICalculator {
    constructor(params) {
        this.params = params;
        this.validator = new DataValidator();
        
        // 定义关键计算系数
        this.COEFFICIENTS = {
            capacityUtilization: 0.8,    // 产能利用率系数
            aluminumPrice: 15000,        // 铝材单价（元/吨）
            moldChangeTimeRatio: 0.05    // 换膜时间占比（5%）
        };
    }

    calculate() {
        if (!this.validator.validateInput(this.params)) {
            throw new Error('参数验证失败: ' + this.validator.errors.join('; '));
        }

        return {
            oeeBenefit: this.calculateOEEBenefit(),
            qualityBenefit: this.calculateQualityBenefit(),
            laborSaving: this.calculateLaborSaving(),
            moldChangeSaving: this.calculateMoldChangeSaving(),
            total: 0  // 将在getTotalBenefit中更新
        };
    }

    calculateOEEBenefit() {
        // OEE提升带来的产值提升
        const improvement = this.params.improvements.oee / 100;
        const mesContribution = this.params.contributions.oee / 100;
        const annualValue = this.params.annualOutput * 1e8; // 转换为元
        const benefit = annualValue * improvement * this.COEFFICIENTS.capacityUtilization;
        const mesBenefit = benefit * mesContribution;
        return {
            total: Math.round(benefit / 10000),
            mesContribution: Math.round(mesBenefit / 10000)
        };
    }

    calculateQualityBenefit() {
        // 废品率改善带来的材料节省
        const materialValue = this.params.aluminumConsumption * this.COEFFICIENTS.aluminumPrice;
        const improvement = this.params.improvements.defect / 100;
        const mesContribution = this.params.contributions.defect / 100;
        const benefit = materialValue * improvement;
        const mesBenefit = benefit * mesContribution;
        return {
            total: Math.round(benefit / 10000),
            mesContribution: Math.round(mesBenefit / 10000)
        };
    }

    calculateLaborSaving() {
        // 人工效率提升带来的成本节省
        const improvement = this.params.improvements.labor / 100;
        const mesContribution = this.params.contributions.labor / 100;
        const benefit = this.params.laborCost * improvement;
        const mesBenefit = benefit * mesContribution;
        return {
            total: Math.round(benefit),
            mesContribution: Math.round(mesBenefit)
        };
    }

    calculateMoldChangeSaving() {
        // 换膜时间缩短带来的产能提升
        const improvement = this.params.improvements.moldChange / 100;
        const mesContribution = this.params.contributions.moldChange / 100;
        const annualValue = this.params.annualOutput * 1e8; // 转换为元
        const benefit = annualValue * this.COEFFICIENTS.moldChangeTimeRatio * 
                       improvement * this.COEFFICIENTS.capacityUtilization;
        const mesBenefit = benefit * mesContribution;
        return {
            total: Math.round(benefit / 10000),
            mesContribution: Math.round(mesBenefit / 10000)
        };
    }

    getTotalBenefit() {
        const benefits = this.calculate();
        const mesTotal = Object.values(benefits).reduce((sum, value) => {
            return sum + (value.mesContribution || 0);
        }, 0);
        benefits.mesTotal = mesTotal;
        return benefits;
    }
} 