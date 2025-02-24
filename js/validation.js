// 铝压铸行业参数配置
const ALLOY_SPECS = {
    ADC12: {
        density: 2.71,  // g/cm³
        meltingPoint: 660, // ℃
        tempRange: { min: 660, max: 690 },
        commonDefects: ['缩孔', '冷隔', '气孔'],
        standardPressure: 800  // 吨
    },
    A380: {
        density: 2.76,
        meltingPoint: 650,
        tempRange: { min: 650, max: 680 },
        commonDefects: ['缩松', '夹渣', '缩孔'],
        standardPressure: 850
    },
    A383: {
        density: 2.74,
        meltingPoint: 655,
        tempRange: { min: 655, max: 685 },
        commonDefects: ['缩孔', '气孔'],
        standardPressure: 820
    }
};

class DataValidator {
    constructor() {
        this.errors = [];
    }

    validateInput(params) {
        this.errors = [];
        
        // 年产值验证
        if (params.annualOutput <= 0 || params.annualOutput > 10) {
            this.errors.push('年产值应在0-10亿元之间');
        }

        // OEE验证
        if (params.currentOEE < 30 || params.currentOEE > 95) {
            this.errors.push('OEE应在30-95%之间');
        }

        // 废品率验证
        if (params.defectRate < 0 || params.defectRate > 20) {
            this.errors.push('废品率应在0-20%之间');
        }

        // 人工成本验证
        if (params.laborCost <= 0) {
            this.errors.push('人工成本必须大于0');
        }

        // 库存资金验证
        if (params.inventoryValue <= 0) {
            this.errors.push('库存资金必须大于0');
        }

        return this.errors.length === 0;
    }

    // 计算铝液损耗
    calculateMeltLoss(params) {
        const baseTemp = ALLOY_SPECS[params.alloyType].meltingPoint;
        const tempDiff = params.meltTemp - baseTemp;
        // 每超温10度增加0.1%的烧损
        const extraLoss = Math.max(0, tempDiff / 10 * 0.001);
        return INDUSTRY_BASELINE.meltLossFactor + extraLoss;
    }

    // 预测模具寿命
    predictMoldLifeEnd(params) {
        const standardLife = 80000;
        const pressureFactor = params.pressure / 
                             ALLOY_SPECS[params.alloyType].standardPressure;
        const tempFactor = (params.meltTemp - 
                          ALLOY_SPECS[params.alloyType].meltingPoint) / 50;
        
        // 压力和温度对模具寿命的影响
        return standardLife * (1 - pressureFactor * 0.1 - tempFactor * 0.15);
    }
} 