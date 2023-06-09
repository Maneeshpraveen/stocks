
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/stocks", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const productSchema = new mongoose.Schema({
  name: String,
  link: String,
  description: String
});

const Product = mongoose.model("Product", productSchema);


app.get("/", function(req, res) {
  res.render("index");
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/create", function(req, res) {
  res.render("create");
});

app.get("/edit", function(req, res) {
  res.render("edit");
});

app.get("/delete", function(req, res) {
  res.render("delete");
});


app.get("/show", function(req, res) {

  Product.find(function(err,products){
    if(err){
      console.log(err);
    }else{
      res.render("show", {
        products: products
      });
    }
  });
});


app.post("/create", function(req, res) {
  const product = new Product({
    name: req.body.productName,
    link: req.body.productLink,
    description: req.body.productDescription
  });
  product.save(function(err) {
    if (err) {
      const result="Something went wrong, Try Again!!."
      res.render("result",{result:result});
    } else {
      const result="Product created successfully."
      res.render("result",{result:result});
    }
  });
});


app.post("/edit", function(req, res) {

  Product.updateOne({
      _id: req.body.productID
    }, {
      name: req.body.productName,
      link: req.body.productLink,
      description: req.body.productDescription
    },
    function(err) {
      if (err) {
        const result="Product doesn't Exist!"
        res.render("result",{result:result});
      } else {
        const result="Product updated successfully."
        res.render("result",{result:result});
      }
    });
});

app.post("/delete", function(req, res) {
      Product.deleteOne({_id:req.body.productID},function(err){
        if(!err){
              const result="Product deleted successfully."
              res.render("result",{result:result});
      }else{
        const result="Product doesn't Exist!"
        res.render("result",{result:result});
      }
    });
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started");
});
