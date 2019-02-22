const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const uuidv4 = require("uuid/v4");
const { fetchNumbers } = require("./utils");

const arr = [...Array(5).keys()]
console.log('hello',arr.slice(0,100000))

const app = express();
app.use(cors());
app.use(bodyParser.json({limit:'4mb'}));
// app.use(bodyParser.urlencoded({extended:true, limit:'4mb'}));
app.post("/", (req, res) => {
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour:"numeric",
    minute:"numeric",
    second:"numeric"
  };
  const nums = [
    {
      id: uuidv4(),
      dateGen: new Date().toLocaleDateString("en-US", options),
      total:req.body.nums.length,
      numbers: req.body.nums
    }
  ];
  fs.writeFileSync("./api/data.json", JSON.stringify(nums));
  res.send({ message: "Success" });
});

app.get("/:limit", (req, res) => {
  const numbers = fetchNumbers(req.params.limit, req.query.order);
  res.send({ numbers });
});

const port = 4000;
app.listen(port);

console.log("App is listening on port " + port);
