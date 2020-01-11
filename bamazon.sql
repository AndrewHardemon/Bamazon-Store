DROP DATABASE IF EXISTS productsdb;

CREATE DATABASE productsdb;

USE productsdb;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  item_id INT(20) NULL,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(6,2) NULL,
  stock_quality INT(20) NULL,
  PRIMARY KEY (id)
)

INSERT INTO products (item_id, product_name, department_name, price, stock_quality)
VALUES (1111, "Bananas", "Food Feeder", 2.10, 50),
(2352, "Robot Baby", "RobotLand", 222.22, 10),
(9764, "Wedding Ring", "Chain 'em n' Drain 'em", 1000.00, 5),
(3434, "Combat Boots", "Stompin Ground", 45.50, 20),
(2222, "Children", "Planned Parenthood", 333.33, 0)