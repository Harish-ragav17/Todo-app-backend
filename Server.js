const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/Todoroute");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5001;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("Failed to connect", err);
  });


app.use(routes);
app.listen(PORT, (req, res) => console.log(`listening on:${PORT}`));
