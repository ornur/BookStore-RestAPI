const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/books", require("./routes/books"));

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));