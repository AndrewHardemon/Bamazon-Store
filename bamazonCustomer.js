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

connection.connect(function(err) {
  if (err) throw err;
  menuCustomer()
});

//Menu
function menuCustomer(){
  inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "Menu Options",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }
  ]).then(function(res) {
    //Which was picked
    if (res.menu === "View Products for Sale") {
      console.log("Products");
      afterConnection();
      menuCustomer();
    }
    else if (res.menu === "View Low Inventory") {
      console.log("Products lower than 5")
      lowConnection();
      menuCustomer();
    }
    else if (res.menu === "Add to Inventory") {
      console.log("this works")
      updateProduct()
    }
    else if (res.menu === "Add New Product") {
      console.log("this works")
      inquirerAdd();
      addProduct();
    }
    else if (res.menu === "Exit") {
      console.log("this works")
      connection.end();
    }
    else {
      menuCustomer();
    }
  });
}

//Check Products
function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    //connection.end();
    inquirer.prompt([
      {
        type: "input",
        message: "Give the ID of the product you want",
        name: "name"
      },
      {
        type: "input",
        message: "How many of the product do you want",
        name: "num"
      }
    ]).then(function(res) {
        buyProduct(res.name, res.num);
    })
  });
}

//Buy the Product
function buyProduct(name, num){
  connection.query("SELECT * FROM products WHERE item_id = ?", [name], function(err, res){
  if (err) throw err;
  if(res.stock_quality === 0){
    console.log("Insuffecient Funds")
  } else {
    console.log(res.price)
    updateProduct(name, -1)
  }
  })
}

//Check for low stock products
function lowConnection() {
  connection.query("SELECT * FROM products WHERE stock_quality <= 5", function(err, res) {
    if (err) throw err;
    //console.log(res);
    //connection.end();
  });
}

//Add more stock to a product
function updateProduct(name, addSub) {
  console.log(`Updating all genre of songs titled Eaten...\n`);
  //connection.query("SQL STRING", arguments, callback()) //This is the order of operations
  connection.query("SELECT * FROM products WHERE item_id = ?", [name], function(err, res) {
    if (err) throw err;
    var nuNum = res.stock_quality + num
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          quantity: 100
        },
        {
          item_id: name
        }
      ],
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " products updated!\n");
        // Call deleteProduct AFTER the UPDATE completes
        deleteProduct();
      });
  });
}



//Helps add new product using inquirer (Part 1)
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
    }
  ]).then(function(res) {
      addProduct(res);
  })
}

//Adds Products with MySQL (Part 2)
function addProduct() {
  console.log("Inserting a new product...\n");
  var query = connection.query(
    "INSERT INTO products SET ?",
    {
      artist: res.price,
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
