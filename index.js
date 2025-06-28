const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const axios = require('axios').default;
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDb Start ---------------------------------------------------------------------------------------------------------------------------------------

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ekx13wz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // Get the database and collection on which to run the operation
    const allFoodsCollection = client.db("cakey'sTwistedBakery").collection('allFoods');


    // Top Food Section from Home Page:
    app.get('/topFoods', async (req, res) => {
      const query = {rating: { $gt: 4.5 }}
      const result = await allFoodsCollection.find(query).limit(8).toArray();
      res.send(result)
    })

    // create AllFoods data with pagination:
    app.get('/allFoods', async (req, res) => {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const skip = page * limit;
      // Fetch total number of documents
      const totalItems = await allFoodsCollection.estimatedDocumentCount();
    
    
      
      const result = await allFoodsCollection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray()
      res.send({
      foods: result,
      totalItems: totalItems,
    });
    })

    







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// MongoDb End -----------------------------------------------------------------------------------------------------------------------------------------------

app.get('/', (req, res) => {
  res.send('Cakeys Twisted Bakery Server!')
})

app.listen(port, () => {
  console.log(`Cakey's Twisted Bakery Server is Running on ${port}`)
})
