
//Top 5 khu vực đông khách 
const calculateTopAreas = (heatmaps) => {
  // Gộp tất cả heatmap_data lại thành một ma trận tổng
  const combined = [];

  heatmaps.forEach(hm => {
    hm.heatmap_data.forEach((row, y) => {
      if (!combined[y]) combined[y] = [];
      row.forEach((val, x) => {
        combined[y][x] = (combined[y][x] || 0) + val;
      });
    });
  });

  // Chuyển sang mảng tọa độ + intensity
  const flat = [];
  combined.forEach((row, y) => {
    row.forEach((val, x) => flat.push({ x, y, intensity: val }));
  });

  // Sắp xếp và lấy top 5
  const top5 = flat.sort((a, b) => b.intensity - a.intensity).slice(0, 5);

  return top5.map((a, i) => ({
    rank: i + 1,
    position: { x: a.x, y: a.y },
    intensity: a.intensity,
    label: a.intensity > 500 ? "Rất đông" : a.intensity > 200 ? "Đông" : "Trung bình",
    colorCode: a.intensity > 500 ? "#ef4444" : a.intensity > 200 ? "#f59e0b" : "#22c55e"
  }));
};

// Thống kê “nhiệt độ”
const calculateTemperatureStats = (heatmaps) => {
  const values = heatmaps.flatMap(h => h.heatmap_data.flat());
  const total = values.reduce((a, b) => a + b, 0);
  const avg = values.length ? total / values.length : 0;
  const max = Math.max(...values);
  const min = Math.min(...values);

  return {
    hottest: max,
    coldest: min,
    avgIntensity: Number(avg.toFixed(2)),
    totalPoints: values.length,
    highDensityPoints: values.filter(v => v > avg).length
  };
};

// Phân tích theo giờ (giả sử mỗi record là một khung giờ)
const calculateHourlyAnalysis = (heatmaps) => {
  // Group theo giờ của created_at
  const hourlyMap = new Map();

  heatmaps.forEach(hm => {
    const hour = new Date(hm.created_at).getHours();
    const avgIntensity = hm.heatmap_data.flat().reduce((a, b) => a + b, 0) / hm.heatmap_data.flat().length;

    if (!hourlyMap.has(hour)) hourlyMap.set(hour, []);
    hourlyMap.get(hour).push(avgIntensity);
  });

  // Tính trung bình mỗi giờ
  const result = [...hourlyMap.entries()].map(([hour, vals]) => {
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const label = avg > 500 ? "Nóng" : avg > 200 ? "Ấm" : "Mát";
    const color = avg > 500 ? "bg-red-500" : avg > 200 ? "bg-yellow-400" : "bg-green-400";

    return {
      time: `${hour}:00 - ${hour + 1}:00`,
      value: Number(avg.toFixed(1)),
      label,
      color
    };
  });

  return result.sort((a, b) => a.time.localeCompare(b.time));
};

module.exports = {
  calculateTopAreas,
  calculateTemperatureStats,
  calculateHourlyAnalysis
};
