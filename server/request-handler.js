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


// var requestHandler = function(request, response) {
//   // Request and Response come from node's http module.
//   //
//   // They include information about both the incoming request, such as
//   // headers and URL, and about the outgoing response, such as its status
//   // and content.
//   //
//   // Documentation for both request and response can be found in the HTTP section at
//   // http://nodejs.org/documentation/api/

//   // Do some basic logging.

//   // Adding more logging to your server can be an easy way to get passive
//   // debugging help, but you should always be careful about leaving stray
//   // console.logs in your code.
//   console.log('Serving request type ' + request.method + ' for url ' + request.url);
//   // console.log('request:', request);

//   // request.on('data', (chunk) => {
//   //   console.log(`BODY: ${chunk}`);
//   // });

//   // The outgoing status.
//   var statusCode = 200;

//   // declare a variable to change based on the http request, to pass in to .end
//   let result;


//   // See the note below about CORS headers.
//   var headers = defaultCorsHeaders;

//   // Tell the client we are sending them plain text.

//   // You will need to change this if you are sending something
//   // other than plain text, like JSON or HTML.
//   // NOTE - was text/plain changed to application/json -- might depend on the response
//   headers['Content-Type'] = 'application/json';

//   // .writeHead() writes to the request line and headers of the response,
//   // which includes the status and all headers.

//   // Make sure to always call response.end() - Node may not send
//   // anything back to the client until you do. The string you pass to
//   // response.end() will be the body of the response - i.e. what shows
//   // up in the browser.
//   //
//   // Calling .end "flushes" the response's internal buffer, forcing
//   // node to actually send all the data over to the client.

//   if (request.method === 'GET') {
//     console.log('get');
//     request.on('end', () => {
//       response.writeHead(statusCode, headers);
//       response.end(allData);
//     });
//     //what should we do when a get request is hit

//   } else if (request.method === 'POST') {
//     //in a successful post, status code should be 201

//     //maybe use array because we might run into multiple data points to store
//     // const body = [];

//     let transformedChunk;
//     //what should we do when a post request is hit
//     request.on('data', (chunk) => {
//       transformedChunk = JSON.stringify(JSON.parse(chunk));
//       console.log('parsed chunk:', transformedChunk);
//     });

//     request.on('end', () => {
//       //might need to parse here on the event of hitting end
//       allData.push(transformedChunk);
//       console.log(allData);

//       //change the status code for successful post
//       response.statusCode = 201;

//       response.writeHead(statusCode, headers);
//       response.end();

//       // const parsedBody = Buffer.concat(body).toString();
//       // console.log('parsed body: ', parsedBody);
//       // const message = parsedBody.split('=')[1];
//     });
//   }


//   request.on('error', (err) => {
//     console.error(err.stack);
//   });


//   //changed from 'Hello, world!' to result variable
//   response.writeHead(statusCode, headers);

//   // Send 404 code if incorrect end point is used
//   response.end(result);
// };





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
  console.log(request.url);
  // Handle Request first
  // Take out headers, method, and URL from request object
  const { method, url } = request;

  let headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';


  var ip = '127.0.0.1';
  var port = 3000;
  var combined = 'http://' + ip + ':' + port;



  // Check URL endpoint & request type
  if (url.includes(combined + '/classes/messages')) {
    console.log('request handler');
    // Check for error event
    request.on('error', (err) => {
      console.error(err);
    });

    if (method === 'POST') {
      // Listen for data event and chain to end event
      //   Access chunk, and transform accordingly
      let transformedChunk;
      request.on('data', (chunk) => {
        //just parse, stringify later
        transformedChunk = JSON.parse(chunk);
      }).on('end', () => {
        allData.push(transformedChunk);
      });

      // let headers = defaultCorsHeaders;
      // headers['Content-Type'] = 'application/json';
      // response.statusCode = 201;
      response.writeHead(201, headers);

      //from raymond - JSON.stringify data here
      // response.end(JSON.stringify(transformedChunk));
      response.end();

    } else if (method === 'GET') {
      response.writeHead(200, headers);
      response.end(JSON.stringify(allData));
    } else if (method === 'OPTIONS') {
      response.writeHead(200, headers);
      response.end();
    }
  }

  response.writeHead(404, headers);

  // Handle Response next

  response.end();
};


// END POINT: `http://127.0.0.1:3000/classes/messages`

// exports.handleRequest = requestHandler;
exports.requestHandler = requestHandler;