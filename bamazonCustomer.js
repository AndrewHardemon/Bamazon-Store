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
      type: "expand",
      name: "menu",
      message: "Menu Options",
      choices: [
        {
          key: 'a',
          name: "View Products for Sale",
          value: "products"
        },
        {
          key: 'b',
          name: "Buy Item",
          value: "buy"
        },
        {
          key: 'c',
          name: "View Low Inventory",
          value: "inventory"
        },
        {
          key: 'd',
          name: "Add to Inventory",
          value: "add"
        },
        {
          key: 'z',
          name: "Add New Product",
          value: "new"
        },
        new inquirer.Separator(),
        {
          key: 'e',
          name: "Exit",
          value: 'exit'
        }
      ]
    }
  ]).then(function(res) {
    //Which was picked
    console.log(res.menu);
    if (res.menu === "products") {
      console.log("All products");
      showProducts();
    }
    if (res.menu === "buy") {
      console.log("Buy it");
      buyProduct();
    }
    else if (res.menu === "inventory") {
      console.log("Products lower than 5")
      lowConnection();
    }
    else if (res.menu === "add") {
      console.log("Adding to an existing product")
      plusProduct()
    }
    else if (res.menu === "new") {
      console.log("Adding a new product")
      inquirerAdd();
    }
    else if (res.menu === "exit") {
      console.log("Goodbye")
      connection.end();
    }
    // else {
    //   menuCustomer();
    // }
  });
}

//Check Products
function showProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    //connection.end();
    menuCustomer();
  });
}


//Buy the Product
function buyProduct(){
  inquirer.prompt([
    {
      type: "input",
      message: "Give the name of the product you want",
      name: "name"
    },
    {
      type: "input",
      message: "How many of the product do you want",
      name: "num"
    }
  ]).then(function(res) {
    // console.log(res.name);
    // console.log(res.num);
    checkProduct(res.name, res.num);
    })
  }

//Check the product if you can buy it
function checkProduct(name, num){
  num = parseInt(num)
    connection.query("SELECT * FROM products WHERE product_name = ?", [name], function(err, res){
    if (err) throw err;
    //console.log(res)

    var amount = parseInt(res[0].stock_quality) - num
    
    if(res.stock_quality === 0){
      console.log("Insuffecient Funds")
    } else {
      var diff = res[0].stock_quality + (num * -1);
      console.log(res[0].price * num)
      console.log(`There are ${amount} ${name} left`)
      updateProduct(name, diff)
    }
  })
}

//Add more stock to a product
function updateProduct(name, diff) {
 connection.query(
  "UPDATE products SET ? WHERE ?",
  [
    {
      stock_quality: diff
    },
    {
      product_name: name
    }
  ],
  function(err, res) {
    if (err) throw err;
    console.log(name + " have been updated!\n");
    menuCustomer();
  });
}

//Check for low stock products
function lowConnection() {
  connection.query("SELECT * FROM products WHERE stock_quality <= 5", function(err, res) {
    if (err) throw err;
    console.log(res);

    menuCustomer()
  });
}

//Add to product
function plusProduct(){
  inquirer.prompt([
    {
      type: "input",
      message: "Give the name of the product you want",
      name: "name"
    },
    {
      type: "input",
      message: "How many of the product do you want",
      name: "num"
    }
  ]).then(function(res) {
    var num = parseInt(res.num);
    var name = res.name;
    connection.query("SELECT * FROM products WHERE product_name = ?", [name], function(err, res){
      if (err) throw err;
      console.log(res)

      var amount = parseInt(res[0].stock_quality) + num
      
      console.log(`There are ${amount} ${name} now`)
      updateProduct(name, amount)
      })
    })
}

//Adds a new product
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
    connection.query(
      "INSERT INTO products SET ?",
      {
        item_id: res.item_id,
        product_name: res.product_name,
        department_name: res.department_name,
        price: res.price,
        stock_quality: res.stock_quality
      }, function(err, res){
        if (err) throw err;
        console.log(` ${res.affectedRows} product inserted!`)
        showProducts();
      }
    )
  })
}
