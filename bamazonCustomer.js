var dotenv = require("dotenv");
var mysql = require("mysql");
var inquirer = require("inquirer");
dotenv.config();

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "productsdb"
});


// * View Products for Sale
    
// * View Low Inventory

// * Add to Inventory

// * Add New Product

function menuCustomer(){
  inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "Menu Options",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
  ]).then(function(res) {

    connection.connect(function(err) {
      if (err) throw err;
      console.log("connected as id " + connection.threadId);

      //Which was picked
      if (res.menu === "View Products for Sale") {
        console.log("Products");
        afterConnection();
        menuCustomer();
      }
      if (res.menu === "View Low Inventory") {
        console.log("Products lower than 5")
        lowConnection();
        menuCustomer();
      }
      if (res.menu === "Add to Inventory") {
        console.log("this works")

      }
      if (res.menu === "Add New Product") {
        console.log("this works")
        inquirerAdd();
        addProduct();
      }
    });
  });
}

//Check Products
function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    //console.log(res);
    //connection.end();
  });
}

function lowConnection() {
  connection.query("SELECT * FROM products WHERE stock_quality <= 5", function(err, res) {
    if (err) throw err;
    //console.log(res);
    //connection.end();
  });
}

//Adds Products with MySQL
function addProduct() {
  console.log("Inserting a new product...\n");
  var query = connection.query(
    "INSERT INTO songs SET ?",
    {
      artist: "Gorgoroth",
      title: "Satan Prometheus",
      genre: "Black Metal"
    }, function(err, res){
      if (err) throw err;
      console.log(` ${res.affectedRows} song inserted!`)
      updateDB();
    }
  )
  console.log(query.sql);

}

//Helps add new product using inquirer
function inquirerAdd(){
  inquirer.prompt([
    {
      type: "input",
      message: "What item would you like to add?",
      name: "item_name"
    },
    {
      type: "input",
      message: "What is the ID?",
      name: "item_id"
    },
    {
      type: "input",
      message: "In what department?",
      name: "department_name"
    },
    {
      type: "input",
      message: "How much will it cost?",
      name: "price"
    },
    {
      type: "input",
      message: "How many would you like to add?",
      name: "stock_quality"
    },
  ]).then(function(res) {})
}