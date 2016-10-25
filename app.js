var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var autoIncrement = require('mongoose-auto-increment');

var port = process.env.PORT || 8080;

var dbConfig = require('./config/database.js');
var connection = mongoose.createConnection(dbConfig.url);

autoIncrement.initialize(connection);

var customerSchema = require('./app/models/customer.js');
customerSchema.plugin(autoIncrement.plugin, {model: 'Customer', field: 'custId'});
var Customer = connection.model('Customer', customerSchema);

var itemSchema = require('./app/models/item.js');
itemSchema.plugin(autoIncrement.plugin, {model: 'Item', field: 'itemId'});
var Item = connection.model('Item', itemSchema);

require('./config/passport.js')(passport);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());

require('./app/routes/base_routes.js')(app, passport);

var userRouter = express.Router();
require('./app/routes/user_routes.js')(userRouter, passport);
app.use('/user', userRouter);

var customerRouter = express.Router();
require('./app/routes/customer_routes.js')(customerRouter, Customer);
app.use('/customer', customerRouter);

var itemRouter = express.Router();
require('./app/routes/item_routes.js')(itemRouter, Item);
app.use('/item', itemRouter);

app.listen(port, function(){
	console.log('Server listening on port: %s!', port);
});