const mongoose = require('mongoose');
// Connection URL
const uri = 'mongodb://localhost:27017/?directConnection=true';


const connectionMongo = async () => {
  try {
    await mongoose.connect(uri, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName:'storelens'
       });
    console.log("Connected to mongo server");
  } catch (error) {
    console.error("Could not connect to mongo server", error);
    process.exit(1);
  }
}
module.exports = {connectionMongo}