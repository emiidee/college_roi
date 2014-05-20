var express = require('express');
var app = express();

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/static'));

app.get ('/', function(request, response) {
  response.sendfile('index.html');
  // response.render('index.html', function(err, html){
  //   console.log('hello');
  // });
});

app.get ('/data.csv', function(request, response) {
  response.sendfile('/data.csv');
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});