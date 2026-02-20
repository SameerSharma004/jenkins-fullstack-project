const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config(); 

const uri = process.env.MONGODB_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const connectDB = async () => {
  try {
    await client.connect();
    
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB and ping successful!");

    const db = client.db("gofoodmern"); 
    const food_items = await db.collection("food_items").find({}).toArray();
    const food_category = await db.collection("food_category").find({}).toArray();


    // Storing the client globally for use in your routes
    global.dbClient = client; 
    global.food_items = food_items;
    global.food_category = food_category;
    
  } catch (error) {
    console.error('Error connecting to MongoDB or fetching data:', error);
  }
};

module.exports = connectDB;
