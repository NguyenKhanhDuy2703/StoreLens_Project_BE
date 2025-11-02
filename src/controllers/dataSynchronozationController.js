const dataSynchronizationController = async (req, res) => {
    try {
        res.status(200).json({
            message: "Data Synchronization Controller is working",
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
