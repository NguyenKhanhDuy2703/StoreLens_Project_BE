
// Lấy Flow Paths
 
const getFlowPaths = (tracks) => {
  return tracks.map(t => ({
    person_id: t.person_id,
    camera_id: t.camera_id,
    path_data: t.path_data
  }));
};

// Lấy Flow Stats
const getFlowStats = (tracks) => {
  if (!tracks.length) {
    return [
      { label: "Tuyến chính", percent: 0 },
      { label: "Tuyến phụ", percent: 0 },
      { label: "Tuyến ít", percent: 0 }
    ];
  }

  const stepCounts = tracks.map(t => t.path_data.length);
  const avgSteps = stepCounts.reduce((a,b)=>a+b,0)/stepCounts.length;

  let mainCount = 0, secondaryCount = 0, minorCount = 0;
  for (const steps of stepCounts) {
    if (steps >= avgSteps*1.2) mainCount++;
    else if (steps >= avgSteps*0.8) secondaryCount++;
    else minorCount++;
  }

  const total = stepCounts.length;
  const percent = n => ((n/total)*100).toFixed(1);

  return [
    { label: "Tuyến chính", percent: percent(mainCount) },
    { label: "Tuyến phụ", percent: percent(secondaryCount) },
    { label: "Tuyến ít", percent: percent(minorCount) }
  ];
};

// Lấy Hot Zones

const getHotZones = (heatmaps, cameras) => {
  if (!heatmaps.length) return [];

  // Map camera_id (ObjectId/string) -> area_name
  const cameraMap = Object.fromEntries(
    cameras.map(c => [c._id.toString(), c.analysis_area?.area_name ?? c.camera_name])
  );

  const grouped = {};
  for (const hm of heatmaps) {
    // Chuyển camera_id thành string để lookup
    const camIdStr = hm.camera_id.toString();
    const label = cameraMap[camIdStr] ?? `Camera ${camIdStr}`;

    const flat = hm.heatmap_data.flat();
    const avg = flat.reduce((a,b)=>a+b, 0) / flat.length;

    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(avg);
  }

  // Tính intensity trung bình và sắp xếp
  return Object.entries(grouped)
    .map(([label, values]) => {
      const avg = values.reduce((a,b)=>a+b, 0) / values.length;
      return { label, intensity: Math.round(avg) };
    })
    .sort((a,b) => b.intensity - a.intensity);
};


module.exports = {
  getFlowPaths,
  getFlowStats,
  getHotZones
};
