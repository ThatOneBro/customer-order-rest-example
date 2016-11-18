var express = require('express');
var app = express();

///////////////////////////////////
/*---Package Includes---*/
//////////////////////////////////

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var autoIncrement = require('mongoose-auto-increment');

/*---Port: Environment Variable or 8080 by default ---*/
var port = process.env.PORT || 8080;

/*---Include Config File for Database and Create a Connection---*/
var dbConfig = require('./config/database.js');
var connection = mongoose.createConnection(dbConfig.url);

autoIncrement.initialize(connection);

///////////////////////////////////////
/*---Schema Initialization---*/
/////////////////////////////////////

//Include schema from file
var customerSchema = require('./app/models/customer.js');

//Add autoincrement plugin to the schema
customerSchema.plugin(autoIncrement.plugin, {model: 'Customer', field: 'custId'});

//Create the model
var Customer = connection.model('Customer', customerSchema);


//Same thing here
var itemSchema = require('./app/models/item.js');
itemSchema.plugin(autoIncrement.plugin, {model: 'Item', field: 'itemId'});
var Item = connection.model('Item', itemSchema);

//And here
var orderSchema = require('./app/models/order.js');
orderSchema.plugin(autoIncrement.plugin, {model: 'Order', field: 'orderId'});
var Order = connection.model('Order', orderSchema);

//////////////////////////////////////////////
/*---Express Middleware Setup---*/
/////////////////////////////////////////////

//Including passport config and passing the passport middleware to the function
require('./config/passport.js')(passport);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());

//////////////////////////////////
/*---Express Routers ---*/
/////////////////////////////////

//Include the base routes for the default app handler (example.com/)
require('./app/routes/base_routes.js')(app, passport);

/*---User Router (example.com/user/) ---*/ 

//Create userRouter from express package
var userRouter = express.Router();

//Include the user routes folder and pass the userRouter to the function in order to be used by the function
require('./app/routes/user_routes.js')(userRouter, passport);

//Take the router and set Express app to use this middleware on the /user route
app.use('/user', userRouter);


/*---Customer Router (example.com/customer/) ---*/ 
var customerRouter = express.Router();
//Here we pass some of our schemas to the route handler function to use with our router
require('./app/routes/customer_routes.js')(customerRouter, Customer, Order, Item);
app.use('/customer', customerRouter);

/*---Item Router (example.com/item/) ---*/ 
var itemRouter = express.Router();
require('./app/routes/item_routes.js')(itemRouter, Item);
app.use('/item', itemRouter);

/*---Order Router (example.com/order/) ---*/ 
var orderRouter = express.Router();
require('./app/routes/order_routes.js')(orderRouter, Order);
app.use('/order', orderRouter);

//Tell the app to listen on our configured port, and execute the function to log upon success
app.listen(port, function(){
	console.log('Server listening on port: %s!', port);
});