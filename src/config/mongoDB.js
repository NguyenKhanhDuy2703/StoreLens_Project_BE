const mongoose = require('mongoose');

// Connection URL
const uri = 'mongodb://localhost:27017/?directConnection=true';
const uriMongoCloud = "mongodb+srv://nguyenkhanhduy:duy270304@cluster0.v5l4v9l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectionMongo = async () => {
  try {
    await mongoose.connect(uriMongoCloud, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName:'storelens'
       });
    console.log("Connected to mongo server");
  } catch (error) {
    console.error("Could not connect to mongo server", error);
    process.exit(1);
  }
};

module.exports = { connectionMongo };


