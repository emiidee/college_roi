var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));

app.get ('/', function(request, response) {
  response.sendfile('index.html');
  // response.render('index.html', function(err, html){
  //   console.log('hello');
  // });
});

app.get ('/data.csv', function(request, response) {
  response.sendfile('/data_clean.csv');
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});