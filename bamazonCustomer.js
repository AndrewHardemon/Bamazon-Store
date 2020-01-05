var dotenv = require("dotenv");
var mysql = require("mysql");
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
  console.log("connected as id " + connection.threadId);
  //then (can add if statements or similar)
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM people", function(err, res) {
    if (err) throw err;
    console.log(res);
    //console.log(JSON.stringify(res));
    connection.end();
  });
}
