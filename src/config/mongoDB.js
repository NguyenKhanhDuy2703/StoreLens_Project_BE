const mongoose = require('mongoose');
require('dotenv').config();

// Connection URL
const uri = 'mongodb://localhost:27017/?directConnection=true';
const uriMongoCloud = process.env.uriMonogoDB;
console.log("uriMongoCloud:", uriMongoCloud);
const connectionMongo = async () => {
  try {
    await mongoose.connect(uriMongoCloud, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName:'storelens'
       });
    const collections = await mongoose.connection.db.listCollections().toArray(); 
    console.log("Collections in the database: " , collections.map(col => col.name));

    console.log("Connected to mongo server");
  } catch (error) {
    console.error("Could not connect to mongo server", error);
    process.exit(1);
  }
};

module.exports = { connectionMongo };


