const { MongoClient, ObjectId } = require("mongodb");

const cors = require("cors");
const uri = "mongodb://127.0.0.1:27017/users";

const client = new MongoClient(uri);

let db;

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
    db = client.db("users");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB", error);
  });

// Now you can use the `db` object in your API handlers

const express = require("express");
const bodyParser = require("body-parser");

const app = express();  
const port = 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/users", (req, res) => {
  const { name, age } = req.body;

  const usersCollection = db.collection("users");
  const newUser = { name, age };

  usersCollection
    .insertOne(newUser)
    .then((result) => {
      console.log("Added user:", newUser);
      res.status(201).json(newUser);
    })
    .catch((error) => {
      console.log("Failed to add user", error);
      res.status(500).send("Failed to add user");
    });
});
app.get("/getUsers", (req, res) => {
  const usersCollection = db.collection("users");

  usersCollection
    .find({})
    .toArray()
    .then((users) => {
      console.log("Retrieved users:", users);
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log("Failed to retrieve users", error);
      res.status(500).send("Failed to retrieve users");
    });
});


app.delete("/deleteData/:id", (req, res) => {
  const id = req.params.id;
  const usersCollection = db.collection("users");
  usersCollection
    .deleteOne({ _id: new ObjectId(id) })
    .then((result) => {
      console.log(`Deleted ${result.deletedCount} document(s)`);
      res.sendStatus(204);
    })
    .catch((error) => {
      console.error("Error deleting data:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.put("/updateData/:id", (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;
  const usersCollection = db.collection("users");

  usersCollection
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, age } },
      { upsert: false }
    )
    .then((result) => {
      console.log(`Updated user with id ${id}`);
      res.status(200).json({ status: "Ok", data: "Updated" });
    })
    .catch((error) => {
      console.log(`Failed to update user with id ${id}`, error);
      res.status(500).send("Failed to update user");
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
