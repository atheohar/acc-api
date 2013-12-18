
process.env.TZ = "Europe/London";

var _ = require('underscore'),
    util = require('util'),
    express = require('express'),
    expressValidator = require('express-validator'),
    AccountHandler = require('./routes/account.js'),
    TransactionHandler = require('./routes/transaction.js'),
    mongoskin = require('mongoskin');


//Setup DB
var db = mongoskin.db('localhost:27017/acc_app', {safe:true});

//Setup Express
var app = express();

//Use body parser to extract body params
app.use(express.bodyParser());
//Use express validator to valid body params
app.use(expressValidator());

//Set up static file serving
app.use('/test', express.static(__dirname + '/static'));
app.use('/js', express.static(__dirname + '/static/js'));
app.use('/css', express.static(__dirname + '/static/css'));
app.use('/fonts', express.static(__dirname + '/static/fonts'));

//Home page
app.get('/', function(req, res, next){
    res.send('Acc API');
});

var accountHandler = new AccountHandler(db);
var transactionHandler = new TransactionHandler(db);

//Account routes
app.post('/account', accountHandler.createAccount);
app.del('/account', accountHandler.deleteAccount);
app.get('/account/:id', accountHandler.readAccount);
app.get('/account', accountHandler.getAccounts);
app.put('/account', accountHandler.updateAccount);
app.post('/account/increment', accountHandler.incrementAccount);

//Transaction routes
app.post('/transaction', transactionHandler.createTransaction);
app.get('/transaction/:id/:type?/:date_start?/:date_end?', transactionHandler.getTransactions);


//Error middleware
app.use(function(err, req, res, next) {
    res.send(500, {status:500, message: err.toString() || 'internal error', type:'internal'});
});

//Start server
app.listen(3000);
console.log('Listening on port 3000');