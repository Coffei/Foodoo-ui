/**
 * Created by jtrantin on 30.8.15.
 */
var express = require("express");
var bodyParser = require("body-parser");
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = parseInt(process.env.PORT, 10) || 8000;
var publicDir = process.argv[2] || __dirname;

var app = express();

app.get("/", function (req, res) {
  res.redirect("/index.html");
});

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(publicDir));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

console.log("Foodoo UI static server showing %s listening at http://%s:%s", publicDir, hostname, port);
app.listen(port, hostname);
