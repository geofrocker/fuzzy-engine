const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const uuidv4 = require("uuid/v4");
const { fetchNumbers } = require("./utils");
const config = require("../../config");

const app = express();
app.use(express.static(path.join(process.env.PWD || __dirname, "build")));
app.use(cors());
app.use(bodyParser.json({ limit: "4mb" }));
// app.use(bodyParser.urlencoded({extended:true, limit:'4mb'}));
app.post("/", (req, res) => {
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };
  if (!req.body.nums) {
    res.status(400).send({ message: "No data sent" });
  }
  const nums = [
    {
      id: uuidv4(),
      dateGen: new Date().toLocaleDateString("en-US", options),
      total: req.body.nums.length,
      numbers: req.body.nums
    }
  ];
  fs.writeFileSync(config.env.path, JSON.stringify(nums));
  res.status(201).send({ message: "Success" });
});

app.get("/:limit", (req, res) => {
  const numbers = fetchNumbers(
    req.params.limit,
    req.query.order,
    req.query.fakePath
  );
  res.status(200).send({ numbers });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "./../../build/index.html"));
});

const port = 5000;
app.listen(process.env.PORT || port);

console.log("App is listening on port " + port);

module.exports = app;
