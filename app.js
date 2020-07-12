// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(`${__dirname}/date.js`);

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// creates, connects to to-do list database
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

// creates database schema
const itemSchema = {
  name: String
};

// creates item model
const Item = mongoose.model("Item", itemSchema);


// home route renders database items
app.get("/", (req, res) => {
  const day = date.getDate();

  Item.find({}, (err, foundItems) => {
    res.render("list", {listTitle: day, newListItems: foundItems});
  });
});


// adds new items, stores inside database
app.post("/", (req, res) => {
  const newItem = new Item({
    name: req.body.newItem
  });
  newItem.save();

  res.redirect("/"); // redirects to home route in order to be rendered
});


// deletes items when checkbox is checked
app.post("/delete", (req, res) => {
  Item.findByIdAndRemove(req.body.checkbox, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
