const mongoose = require('mongoose');
require('dotenv').config();

// Connection URL
const uri = 'mongodb://localhost:27017/?directConnection=true';
const uriMongoCloud = process.env.uriMonogoDB;

const connectionMongo = async () => {
  try {
    await mongoose.connect(uriMongoCloud, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName:'StoreLens'
       });
    console.log("Connected to mongo server");
  } catch (error) {
    console.error("Could not connect to mongo server", error);
    process.exit(1);
  }
};

module.exports = { connectionMongo };


