var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

var port = process.env.PORT || 8080;

var dbConfig = require('./config/database.js');
mongoose.connect(dbConfig.url);

require('./config/passport.js')(passport);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());

require('./app/routes/base_routes.js')(app, passport);

var userRouter = express.Router();
require('./app/routes/user_routes.js')(userRouter, passport);
app.use('/user', userRouter);

app.listen(port, function(){
	console.log('Server listening on port: %s!', port);
});