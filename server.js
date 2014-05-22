var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var morgan = require('morgan'); 

app.use(morgan({format: 'short'}));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));

app.get ('/data.csv', function(request, response) {
  response.sendfile('/data.csv');
});

var server = app.listen(port, function() {
  console.log('Listening on port %d', server.address().port);
});
