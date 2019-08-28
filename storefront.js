var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "dak0!-MMP",
    database: "storefront"
});

connection.connect(function (err) {
    if (err) {
        console.log("error!")
        return
    }
    console.log("successful connection")
    //   run start function after connect 
    start();
});

// define start function 

function start() {
    //    ask question to the user 
    inquirer
        .prompt({
            name: "welcomeMessage",
            type: "list",
            message: "Welcome to Martin's General Store! Would you like to view our catalogue?",
            choices: ["Yes please!", "No thanks, perhaps another time"]
        })
        // answer function w if/else statement
        .then(function (answer) {
            // view catalogue, or end connection if they dont want to 
            if (answer.welcomeMessage === "Yes please!") {
                displayProducts();
            }
            else {
                connection.end();
            }
        })

}


function displayProducts() {
    connection.query(
        "SELECT * FROM products", function (err, res) {
            if (err) throw err;

         console.table(res);
            
         letsGoShopping()
        });
       
    }



function letsGoShopping() {
    inquirer
        .prompt([{
            name: "shop",
            type: "input",
            message: "Please enter the product id # to order",


        },
        {
            name: "howMany",
            type: "input",
            message: "Thanks! \n please enter how many you would like to buy"

        }]).then(function (answer) {

            connection.query(
                "SELECT * FROM products", function (err, res) {
                    if (err) throw err;

                    // variable for selected item 
                    var item;
                    // loop through results and match item id with input answer 
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === parseFloat(answer.shop)) {
                            item = res[i];
                            


                        }
                    }

                    // if the item is available (stock is greater than order amount)
                    if (item.stock_quantity > parseFloat(answer.howMany)) {

                        // update the remaining stock in the database 
                        connection.query(
                            "UPDATE products SET ? WHERE?",
                            // fill in place holders with values stored in array
                            [{
                                // set 
                                stock_quantity: (item.stock_quantity - parseFloat(answer.howMany))

                            },
                            {
                                // where 
                                id: (item.id)
                            }],
                            console.log("you are ordering " + answer.howMany + " " + item.product_name + "'s" +
                            
                            "\nThanks for shopping with us! Your total is " + "£" + parseFloat(answer.howMany) * item.price)
                            
                            
                        )
                        connection.end();
                    }

                    else {
                        console.log("Sorry we dont have enough of that item, back to our product list!" +
                        "\n=============================================================================")
                        displayProducts();
                    }


                });
        });
};







// SCHEMA
//=================
// USE storefront;

// CREATE TABLE products (
// id INT NOT NULL AUTO_INCREMENT,
// product_name VARCHAR(100) NOT NULL,
// department_name VARCHAR(50) NOT NULL,
// price INT,
// stock_quantity INT
// )

// INSERT INTO products (product_name, department_name, price) values ('Playstation 4', 'Electronics', 399);
// INSERT INTO products (product_name, department_name, price) values ('Hamburger Sandwich', 'Food', 5);
// INSERT INTO products (product_name, department_name, price) values ('Samsung UHD TV', 'Electronics', 700);
// INSERT INTO products (product_name, department_name, price) values ('Ping Pong Table', 'Sports', 350);
// INSERT INTO products (product_name, department_name, price) values ('Ford Mustang', 'Automotive', 21000);
// INSERT INTO products (product_name, department_name, price) values ('Smart Fridge', 'Appliances', 2000);
// INSERT INTO products (product_name, department_name, price) values ('Toaster Oven', 'Appliances', 50);
// INSERT INTO products (product_name, department_name, price) values ('iPad', 'Electronics', 400);
// INSERT INTO products (product_name, department_name, price) values ('Table Saw', 'Power Tools', 500);
// INSERT INTO products (product_name, department_name, price) values ('Belt Sander', 'Power Tools', 200);
// INSERT INTO products (product_name, department_name, price) values ('Oscar Meyer Wiener-Mobile', 'Automotive', 150000);

