/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var messages = [
  {
    username: 'Jackson',
    text: 'what\'s up'
  },
  {
    username: 'Jeff',
    text: 'not much'
  }
];

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  
  var { headers, method, url } = request;
  
  
    
  var statusCode;
  var responseBody;

  if (url === '/classes/messages') {
    if (method === 'GET') {
      statusCode = 200;
      responseBody = JSON.stringify({results: messages});
    } else if (method === 'POST') {
      statusCode = 201;
      let body = [];
      request.on('error', (err) => {
        console.error(err);
      }).on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        messages.unshift(JSON.parse(Buffer.concat(body).toString()));
      });
      responseBody = JSON.stringify({results: messages});
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
              'description': 'name of user who is postiing the message',
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
    } else {
      statusCode = 405;
    }
  } else {
    statusCode = 404;
  }
  
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  response.writeHead(statusCode, headers);
  response.end(responseBody);
  

};



module.exports.requestHandler = requestHandler;

