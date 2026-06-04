require("dotenv").config();

const express = require("express");
const todoRoutes = require("./routes/todoRoutes");
const carsRoutes = require("./routes/carsRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express MongoDB Todo API 서버 실행 중");
});

app.use("/todos", todoRoutes);
app.use('/cars', carsRoutes);

const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  await client.connect();

  const db = client.db("todoList");
  const collection = db.collection("todos");

  const result = await collection.findOne({ title: "Node.js 공부" });
  console.log(result);

  await client.close();
}

run();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});