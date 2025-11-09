const ZoneSummary = require("../schemas/zonesSummary.model");
const StoreSummary = require("../schemas/storesSummary.model");
const {storeSummaryData ,zoneSummariesData } = require("../dataSample");
const dataSynchronizationController = async (req, res) => {
    try {
        for (const summary of zoneSummariesData) {
            let newSummary = new ZoneSummary(summary);
            await newSummary.save();
        }
        let storeSummary = new StoreSummary(storeSummaryData);
        await storeSummary.save();
        res.status(200).json({
            message: "Data Synchronization Controller is working",
            data: { storeSummary, zoneSummariesData },
        });
    }
    catch (error) {
        console.error("Error in dataSynchronizationController:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }

}
module.exports = {
    dataSynchronizationController
};
