const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b8fibtq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const productsCollection = client.db('craftProductsDB').collection('craftProducts');

    app.post('/craftProduct', async(req, res)=>{
      const craftProduct = req.body;
      const result = await productsCollection.insertOne(craftProduct);
      res.send(result);
    })

    app.get('/craftProduct', async(req, res)=>{
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/craftProduct/:email', async(req, res)=>{
      const userEmail = req.params.email;
      const cursor = productsCollection.find({userEmail});
      const result = await cursor.toArray();
      res.send(result);
    })

    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('art and craft store server is running');
})

app.listen(port, ()=>{
    console.log(`server is running at port ${port}`);
})