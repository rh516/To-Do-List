//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

//create database schema
const itemsSchema = {
  name: String
};

//create object model
const Item = mongoose.model("Item", itemsSchema);

//home route renders database items
app.get("/", function(req, res) {
  const day = date.getDate();

  Item.find({}, function(err, foundItems) {
    res.render("list", {listTitle: day, newListItems: foundItems});
  });
});

//adds new items, stores inside database
app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const newItem = new Item ({
    name: itemName
  });
  newItem.save();

  res.redirect("/"); //redirects to home route in order to be rendered
});

//deletes items when checkbox is checked
app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err){
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
