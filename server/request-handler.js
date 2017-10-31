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
  }];

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  
  var { headers, method, url } = request;
  
  
    
  var statusCode;

  if (url === '/classes/messages') {
    if (method === 'GET') {
      statusCode = 200;
    } else if (method === 'POST') {
      statusCode = 201;
      let body = [];
      request.on('error', (err) => {
        console.error(err);
      }).on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        messages.unshift(JSON.parse(body));
      });
    } else if (method === 'OPTIONS') {
      statusCode = 200;
    }
  } else {
    statusCode = 404;
  }
  
  var headers = defaultCorsHeaders;
  
  headers['Content-Type'] = 'text/plain';

  response.writeHead(statusCode, headers);

  response.end(JSON.stringify({results: messages}));
    


};



module.exports.requestHandler = requestHandler;

