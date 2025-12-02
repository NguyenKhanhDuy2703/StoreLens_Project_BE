

const analyzeZone = (data, benchmark) => {
  const { avgTime, totalSales, conversionRate, peopleCount } = data;
  const { avgTime: bmTime, avgSales: bmSales, avgConversion: bmConv } = benchmark;
  const timeRatio = avgTime / (bmTime || 1);
  const salesRatio = totalSales / (bmSales || 1);
  const rules = [
    {
      condition: () => timeRatio >= 1.2 && salesRatio >= 1.2,
      result: {
        type: 'STAR',
        label: 'Siêu Hiệu Quả',
        action: 'Nhân rộng mô hình trưng bày',
        priority: 1 
      }
    },
    {
      condition: () => timeRatio >= 1.1 && salesRatio < 0.8,
      result: {
        type: 'CRITICAL_WARNING',
        label: 'Cảnh báo: Tỉ lệ chốt thấp',
        action: 'Kiểm tra giá / Tư vấn ngay',
        priority: 1
      }
    },
    {
      condition: () => timeRatio < 0.9 && salesRatio >= 1.1,
      result: {
        type: 'CASH_COW',
        label: 'Chốt đơn thần tốc',
        action: 'Upsell / Bán kèm tại quầy',
        priority: 2
      }
    },
    {
      condition: () => salesRatio < 0.6, 
      result: {
        type: 'POOR',
        label: 'Hiệu suất kém',
        action: 'Thay đổi luồng đi / Quảng cáo',
        priority: 3
      }
    },
    {
      condition: () => true, 
      result: {
        type: 'NORMAL',
        label: 'Hoạt động ổn định',
        action: 'Duy trì & Theo dõi',
        priority: 4
      }
    }
  ];
  const matchedRule = rules.find(rule => rule.condition());
  return matchedRule.result;
};
module.exports = { analyzeZone };