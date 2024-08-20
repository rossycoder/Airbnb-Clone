const mongoose = require("mongoose");
const initDB = require("./Data.js");
const List = require("../models/listing.js");

const dburl=process.env.MONGO_DB
const connectDatabase = async () => {
  try {
    await mongoose.connect(dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      serverSelectionTimeoutMS: 30000, socketTimeoutMS: 45000 
    });
    console.log("Connected to MongoDB");

    // Perform a simple query to test the connection
    const List = mongoose.model('List', new mongoose.Schema({}));
    const lists = await List.find({});
    console.log('Listings:', lists);
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

connectDatabase();
console.log(MONGO_DB)

