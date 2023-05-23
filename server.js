
///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 4000
// pull MONGODB_URL from .env
const { PORT = 4000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middlware
const cors = require("cors");
const morgan = require("morgan");

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const DishSchema = new mongoose.Schema({
  name: String,
  image: String,
  rating: Number,
  orderAgain: Boolean,
  restaurant: String,
});

const Dishes = mongoose.model("Dishes", DishSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies
app.use(express.urlencoded({ extended: true }));

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
  res.send("hello world");
});

// DISHES INDEX ROUTE
app.get("/dishes", async (req, res) => {
  try {
    // send all dishes
    res.json(await Dishes.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// DISHES CREATE ROUTE
app.post("/dishes", async (req, res) => {
  try {
    // send all dishes
    res.json(await Dishes.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// DISHES DELETE ROUTE
app.delete("/dishes/:id", async (req, res) => {
  try {
    // send all dishes
    res.json(await Dishes.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// DISHES UPDATE ROUTE
app.put("/dishes/:id", async (req, res) => {
  try {
    // send all dishes
    res.json(
      await Dishes.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));