const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.post("/objects", (req, res) => {
  if (Math.random() < 0.7) {
    res.json(req.body);
  } else {
    res.status(404).send();
  }
});
app.listen(3000);
