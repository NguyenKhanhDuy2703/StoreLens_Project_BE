const { getTracking } = require("../api/trackingApi");
const cameraModel = require("../schemas/cameras.schema");
const heatmapModel = require("../schemas/heatmap.schema");

const heatmapService = {
    async getHeatMap(){
        try {
            console.log("Get heatmap started.....");
            const heatmapData = await getTracking();

            return heatmapData.data_heatmap;
        } catch (error) {
            console.error("Error in getHeatMap:", error);
            throw error;
        }  
    },
    async saveHeatmap(data){
        console.log("Save heatmap started.....");
        const newHeatmap = new heatmapModel({
            store_id : 0,
            camera_id : 0,
            heatmap_data : data,
            created_at : new Date(),
            updated_at : new Date()
        });
        await newHeatmap.save();
    },
}
module.exports = heatmapService;