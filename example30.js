/*********************************************************************        
University of Maribor ************************************************
Faculty of Organizational Sciences ***********************************
Cybernetics & Decision Support Systems Laboratory ********************
Andrej Škraba ********************************************************
*********************************************************************/

//The connection should be secure, i.e. https - don't forget to put [s] in the Chrome address i.e. https://172...
//Therefore, the certificate files should be generated in Linux terminal (in the cps-iot directory):
//sudo openssl genrsa -out privatekey.pem 1024
//sudo openssl req -new -key privatekey.pem -out certrequest.csr
//sudo openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
//This will generate two files, privatekey.pem and certificate.pem on the disc in the cps-iot directory. 

var firmata = require("firmata");

var board = new firmata.Board("/dev/ttyACM0",function(){
    console.log("Connection to Arduino");
    console.log("Enabling pins");
    board.pinMode(13, board.MODES.OUTPUT); // enable pin 13 for turning the LED on and off
});

var fs  = require("fs");

var options = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('certificate.pem')
};

var https = require("https").createServer(options, handler) // here the argument "handler" is needed, which is used latter on -> "function handler (req, res); in this line, we create the server! (https is object of our app)
  , io  = require("socket.io").listen(https, { log: false })
  , url = require("url");

function handler(req, res) {
    fs.readFile(__dirname + "/example30.html",
    function (err, data) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Error loading html page.");
        }
    res.writeHead(200);
    res.end(data);
    })
}

https.listen(8080);  // determine on which port we will listen | port 80 is usually used by LAMP | This could be determined on the router (http is our main object, i.e.e app)

console.log("Use (S) httpS! - System Start - Use (S) httpS!"); // we print into the console that in the Chrome browser, the httpS (S!=Secure) should be used i.e. https://...

board.on("ready", function() {

io.sockets.on("connection", function(socket) {  // from the parentesis ( on we have an argument of function -> at "connection" the argument is conveyed, i.e. function(socket)
                                                // when somebody calls an IP over browser (this means that browser sends something to node.js) the "connection" is established
                                                // so each time when browser request something from the server the connection is established    
                                                // in this case, the client wants to send something (when somebody access our server over IP and port)
                                                // when the connection is established, we have to execute the function : function(socket)    
                                                // here the data of the socket is in the argument, i.e. argument=socket
                                                // the unique socket_id is created
    
    socket.on("left", function(data) { // so we listen to the socket when the connecton is established .on("connection"...), and we wait for the message "left"
        board.digitalWrite(13, board.HIGH); // if we hear the message "left" we write HIGH value on pin 13
    });
    
	socket.on("center", function(data) {
        board.digitalWrite(13, board.LOW);
    });
    
    socket.on("right", function(data) {
        board.digitalWrite(13, board.HIGH);
    });

});
    
}); // end of board.on ready