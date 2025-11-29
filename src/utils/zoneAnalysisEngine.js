

const analyzeZone = (data, benchmark) => {
  const { avgTime, totalSales, conversionRate, peopleCount } = data;
  const { avgTime: bmTime, avgSales: bmSales, avgConversion: bmConv } = benchmark;

  // Tính chỉ số so sánh (Ratio) - Ví dụ: 1.2 nghĩa là cao hơn trung bình 20%
  const timeRatio = avgTime / (bmTime || 1);
  const salesRatio = totalSales / (bmSales || 1);
  // const convRatio = conversionRate / (bmConv || 1); // Nếu có conversion rate

  // === ĐỊNH NGHĨA CÁC CHIẾN LƯỢC (STRATEGIES) ===
  // Thứ tự ưu tiên: Từ trên xuống dưới. Cái nào return trước thì lấy.
  
  const rules = [
    {
      // 1. SAO SÁNG (Star): Cực tốt về mọi mặt
      condition: () => timeRatio >= 1.2 && salesRatio >= 1.2,
      result: {
        type: 'STAR',
        label: 'Siêu Hiệu Quả',
        action: 'Nhân rộng mô hình trưng bày',
        priority: 1 // Mức độ quan trọng
      }
    },
    {
      // 2. LÃNG PHÍ (High Traffic & Time but Low Sales): Khách xem nhiều nhưng không mua
      // Đây là trường hợp đau đớn nhất cần fix ngay
      condition: () => timeRatio >= 1.1 && salesRatio < 0.8,
      result: {
        type: 'CRITICAL_WARNING',
        label: 'Cảnh báo: Tỉ lệ chốt thấp',
        action: 'Kiểm tra giá / Tư vấn ngay',
        priority: 1
      }
    },
    {
      // 3. TIỀM NĂNG (Low Time but High Sales): Khách mua rất nhanh
      condition: () => timeRatio < 0.9 && salesRatio >= 1.1,
      result: {
        type: 'CASH_COW',
        label: 'Chốt đơn thần tốc',
        action: 'Upsell / Bán kèm tại quầy',
        priority: 2
      }
    },
    {
      // 4. CẦN CẢI THIỆN (Low Traffic & Low Sales): Vắng vẻ đìu hiu
      condition: () => salesRatio < 0.6, 
      result: {
        type: 'POOR',
        label: 'Hiệu suất kém',
        action: 'Thay đổi luồng đi / Quảng cáo',
        priority: 3
      }
    },
    {
      // 5. ỔN ĐỊNH (Average): Nằm quanh mức trung bình
      condition: () => true, // Default case
      result: {
        type: 'NORMAL',
        label: 'Hoạt động ổn định',
        action: 'Duy trì & Theo dõi',
        priority: 4
      }
    }
  ];

  // Chạy vòng lặp qua các rules, rule nào thỏa mãn condition đầu tiên sẽ được chọn
  const matchedRule = rules.find(rule => rule.condition());
  
  return matchedRule.result;
};

module.exports = { analyzeZone };