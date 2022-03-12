/*************************************************************
You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.
**************************************************************/

const allData = [];

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};



//Notes:
// headers / CORS headers
// all methods/properties available on the response object
// headers is being set and got differently than in the docs

//Objectives:
// need to check what request types come in
// need to know when/how to send back the right kind of data


// HELP DESK TIPS
//request object coming in is a stream of information, want to do an event listener - if the data is coming in we want to build it up and add it to that string

//buffer types, ...on('data', callback) ...on('end', callback), chunks, everything received is in a json.string, everything sent back is in a json.string

//server receives the post request as a chunk (array-like structure) that we need to reconstruct

//return a message to the client that it was successful

//res.end ends the call and can optionally send data


//look into endpoint queries -- later down the road when connecting client

//handle the endpoint request.url, target that endpoint-- wrap it all in this


/*
  first thing to do is look at the method and the URL to determine the appropriate actions

*/


var requestHandler = function (request, response) {
  // Handle Request first
  // Take out headers, method, and URL from request object
  const { method, url } = request;

  let headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';



  // Check URL endpoint & request type
  if (url.includes('/classes/messages')) {
    // Check for error event
    request.on('error', (err) => {
      console.error(err);
    });

    if (method === 'POST') {
      // Listen for data event and chain to end event
      //   Access chunk, and transform accordingly
      let transformedChunk;
      request.on('data', (chunk) => {
        transformedChunk = JSON.parse(chunk);
      }).on('end', () => {
        allData.push(transformedChunk);
      });
      response.writeHead(201, headers);
      response.end();

    } else if (method === 'GET') {
      response.writeHead(200, headers);
      response.end(JSON.stringify(allData));

    } else if (method === 'OPTIONS') {
      response.writeHead(200, headers);
      response.end();

    } else {
      response.writeHead(404, headers);
      response.end();

    }
  } else {
    response.writeHead(404, headers);
    response.end();
  }
};

// END POINT: `http://127.0.0.1:3000/classes/messages`

// exports.handleRequest = requestHandler;
exports.requestHandler = requestHandler;