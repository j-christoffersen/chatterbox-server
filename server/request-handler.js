/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require('fs');
var urlLib = require('url');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var messages = [];

fs.readFile('./messages.txt', (err, data) => {
  if (err) { throw err; }
  messages = JSON.parse(data);
  //clean out test messages
  messages = messages.filter(message => message.username !== 'Jono');
});


var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  
  var { headers, method, url } = request;
  
  var q = urlLib.parse(url, true);
  
  
    
  var statusCode;
  var responseBody;
  var readStream;

  var respond = function(contentType) {
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = contentType;
    response.writeHead(statusCode, headers);
    response.end(responseBody); 
  };
  
  var respondPipe = function(contentType) {
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = contentType;
    response.writeHead(statusCode, headers);
    readStream.pipe(response);
  };
  
  if (q.pathname === '/classes/messages') {
    if (method === 'GET') {
      statusCode = 200;
      responseBody = JSON.stringify({results: messages});
      respond('application/json');
    } else if (method === 'POST') {
      statusCode = 500;
      responseBody = JSON.stringify({results: messages});
      var body = [];
      request.on('error', (err) => {
        console.error(err);
      }).on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        console.log('hello');
        var message = JSON.parse(Buffer.concat(body).toString());
        if (message.username && message.text) {
          statusCode = 201;
          messages.unshift(message);
          fs.writeFile('messages.txt', JSON.stringify(messages), (err) => {
            if (err) { throw err; }
            console.log('The file has been saved!');
          });
        } else {
          statusCode = 400;
        }
        respond('application/json');
      });
    } else if (method === 'OPTIONS') {
      statusCode = 200;
      responseBody = JSON.stringify({
        'GET': {
          'description': 'get all messages',
        },
        'POST': {
          'description': 'post a message',
          'parameters': {
            'username': {
              'type': 'string',
              'description': 'name of user who is posting the message',
              'required': false
            },
            'text': {
              'type': 'string',
              'description': 'body of the message',
              'required': false
            },
            'roomname': {
              'type': 'string',
              'description': 'property for client to use for filtering',
              'required': false
            }
          }
        }
      });
      respond('application/json');
    } else {
      statusCode = 405;
      respond('application/json');
    }
  } else {
    statusCode = 404;
    respond('application/json');
  }
  
  

};



module.exports.requestHandler = requestHandler;

