const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster2002.1tfbne8.mongodb.net/?appName=Cluster2002`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Art GAllery server is starting!");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("artify-db");
    const artCollection = db.collection("arts");
    const favCollection = db.collection("favorites");

    app.get("/arts", async (req, res) => {
      const result = await artCollection.find().toArray();
      res.send(result);
    });

    app.post("/arts", async (req, res) => {
      const data = req.body;
      const result = await artCollection.insertOne(data);
      res.send(result);
    });

    app.get("/my-gallery", async (req, res) => {
      const email = req.query.email;
      const result = await artCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });

    app.put("/arts/:id", async (req, res) => {
      const id = req.params.id;
      const updatedArtwork = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateArt = {
        $set: {
          title: updatedArtwork.title,
          medium: updatedArtwork.medium,
          category: updatedArtwork.category,
          dimensions: updatedArtwork.dimensions,
          price: updatedArtwork.price,
          visibility: updatedArtwork.visibility,
          description: updatedArtwork.description,
          imageUrl: updatedArtwork.imageUrl,
        },
      };
      const result = await artCollection.updateOne(filter, updateArt);
      res.send(result);
    });

    app.delete("/arts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/search", async (req, res) => {
      const search_text = req.query.search;
      const result = await artCollection
        .find({ title: { $regex: search_text, $options: "i" } })
        .toArray();
      res.send(result);
    });

    app.get("/arts/:id", async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);
      const result = await artCollection.findOne({ _id: objectId });
      res.send(result);
    });

    app.post("/favorites", async (req, res) => {
      const data = req.body;
      const result = await favCollection.insertOne(data);
      res.send(result);
    });

    app.get("/favorites", async (req, res) => {
      const result = await favCollection.find().toArray();
      res.send(result);
    });

    app.delete("/favorites/:id", async(req,res)=>{
        const id = req.params.id;
        const result = await favCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Art GAllery is listening on port ${port}`);
});
