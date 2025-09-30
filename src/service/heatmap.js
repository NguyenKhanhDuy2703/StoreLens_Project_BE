// Lấy paths 
const getPaths = async (personModel, store_id, start, end) => {
    const query = {
        status: "active",
        path_data: {
            $elemMatch: {
                timestamp: { $gte: start, $lte: end }
            }
        }
    };

    if (store_id) {
        query.store_id = store_id; 
    }

    return await personModel.find(query);
};

// Tính heatmapData
const calculateHeatmapData = (paths, start, end) => {
    const grid = {};
    paths.forEach(person => {
        person.path_data.forEach(p => {
            if (p.timestamp >= start && p.timestamp <= end) {
                const key = `${p.position.x}_${p.position.y}`;
                grid[key] = (grid[key] || 0) + 1;
            }
        });
    });
    const maxCount = Math.max(...Object.values(grid), 1);
    return Object.keys(grid).map(key => {
        const [x, y] = key.split("_").map(Number);
        return { x, y, intensity: grid[key] / maxCount };
    });
};

// Top 5 khu vực đông khách
const calculateTopCategories = async (cameraModel, store_id, paths) => {
    const cameraQuery = { "analysis_area.enabled": true };
    if (store_id) {
        cameraQuery.store_id = store_id;
    }

    const cameras = await cameraModel.find(cameraQuery);

    const areaCounts = cameras.map(cam => {
        let count = 0;
        paths.forEach(person => {
            person.path_data.forEach(p => {
                cam.analysis_area.coordinates.forEach(coord => {
                    if (Math.abs(p.position.x - coord.x) <= 5 && Math.abs(p.position.y - coord.y) <= 5) {
                        count++;
                    }
                });
            });
        });
        return {
            name: cam.analysis_area.area_name || cam.camera_name,
            count,
            color: count > 80 ? "bg-red-500" : "bg-yellow-500",
            colorCode: count > 80 ? "#ef4444" : "#f59e0b"
        };
    });

    return areaCounts.sort((a, b) => b.count - a.count).slice(0, 5);
};

// Thống kê nhiệt độ
const calculateTemperatureStats = (heatmapData) => {
    const intensities = heatmapData.map(h => h.intensity);
    const hottest = Math.max(...intensities, 0);
    const coldest = Math.min(...intensities, 0);
    const avgIntensity = intensities.length
        ? (intensities.reduce((a,b) => a+b, 0) / intensities.length)
        : 0;
    const totalHotPoints = intensities.reduce((sum, val) => sum + (val > 0.5 ? 1 : 0), 0);
    return { hottest, coldest, avgIntensity, totalHotPoints };
};

// Phân tích theo giờ
const calculateHourlyAnalysis = async (dailySummaryModel, store_id, start, end) => {
    const dailySummary = await dailySummaryModel.find({
        store_id,
        date: { $gte: start, $lte: end }
    });

    return dailySummary.length
        ? dailySummary[0].hourly_breakdown.map(h => {
            const label = h.people_count > 90 ? "Nóng" : "Ấm";
            const color = h.people_count > 90 ? "bg-red-500" : "bg-yellow-400";
            return {
                time: `${h.hour}:00 - ${h.hour + 1}:00`,
                value: h.people_count,
                label,
                color
            };
        })
        : [];
};

module.exports = {
    getPaths,
    calculateHeatmapData,
    calculateTopCategories,
    calculateTemperatureStats,
    calculateHourlyAnalysis
};
