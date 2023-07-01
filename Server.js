const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/Todoroute");
const cors=require("cors")
require("dotenv").config();

const app = express();
const PORT = process.env.port || 5000;

app.use(express.json())
app.use(cors())

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("Failed to connect",err);
  });
app.use(routes);
app.listen(5000, (req, res) => console.log(`listening on:${PORT}`));
