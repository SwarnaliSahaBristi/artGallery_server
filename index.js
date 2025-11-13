const express = require("express");
const cors = require("cors");
const app = express();
const admin = require("firebase-admin");
const serviceAccount = require("./artify-client-d71f6-firebase-adminsdk-fbsvc-ec340bc3ee.json");
require("dotenv").config();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster2002.1tfbne8.mongodb.net/?appName=Cluster2002`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).send({
      message: "unauthorized access. Token not found!",
    });
  }

  const token = authorization.split(" ")[1];
  try {
    await admin.auth().verifyIdToken(token);

    next();
  } catch (error) {
    res.status(401).send({
      message: "unauthorized access.",
    });
  }
};

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
      const result = await artCollection
        .find({ visibility: "Public" })
        .toArray();
      res.send(result);
    });

    app.get("/arts", async (req, res) => {
      const category = req.query.category;
      const query = {};
      if (category) {
        query.category = category
      }
      const result = await artCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/arts",verifyToken, async (req, res) => {
      const data = req.body;
      const result = await artCollection.insertOne(data);
      res.send(result);
    });

    app.get("/my-gallery",verifyToken, async (req, res) => {
      const email = req.query.email;
      const result = await artCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });

    app.put("/arts/:id",verifyToken, async (req, res) => {
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

    app.patch("/arts/like/:id",verifyToken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const result = await artCollection.updateOne(filter, {
        $inc: { likesCount: 1 },
      });

      res.send(result);
    });

    app.get("/featured-arts", async (req, res) => {
      const result = await artCollection
        .find({})
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    app.delete("/arts/:id",verifyToken, async (req, res) => {
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

    app.get("/arts/:id",verifyToken, async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);
      const result = await artCollection.findOne({ _id: objectId });
      res.send(result);
    });

    app.post("/favorites",verifyToken, async (req, res) => {
      const data = req.body;
      const result = await favCollection.insertOne(data);
      res.send(result);
    });

    app.get("/favorites",verifyToken, async (req, res) => {
      const result = await favCollection.find().toArray();
      res.send(result);
    });

    app.delete("/favorites/:id",verifyToken, async (req, res) => {
      const id = req.params.id;
      const result = await favCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

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
