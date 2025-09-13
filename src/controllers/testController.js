const {connectionMongo} = require("../config/mongoDB")
const testSaveDataMongo = async (req, res) => {
    try {
        const client = await connectionMongo();
        const db = client.db("storelens");
        const collection = db.collection("customers_path");
        const result = await collection.insertOne({name: "Test User", info: "This is a test document"});
        console.log(result);
        console.log("Document inserted with _id: ", result.insertedId);
        const getNewDoc = await collection.findOne({ _id: result.insertedId });
        console.log("Retrieved document: ", getNewDoc);
        res.status(200).json({message: "Test save mongo success" })
    } catch (error) {
        res.status(500).json({message: "Error in test save mongo" , error : error.message})
    }
}

module.exports = { testSaveDataMongo };