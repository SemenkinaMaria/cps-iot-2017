var http = require("http").createServer(handler); // on req - handler - function to handle events
var io = require("socket.io").listen(http); // socket library
var fs = require("fs"); // variable for file system for providing html
var firmata = require("firmata");

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){
    console.log("Connecting to Arduino");
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); // pin13 as out
});

// we should define handler function which is an argument in the first line
// to specify how events are handled
// handler is similar function as in example01.js -> http.createServer(function(req, res){...
function handler(req, res) {
    fs.readFile(__dirname + "/assignment03.html",
    function (err, data) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Error loading html page.");
        }
    res.writeHead(200);
    res.end(data);
    })
}

var timer1;
var timer2;

http.listen(8080); // server will listen on port 8080

io.sockets.on("connection", function(socket) {
    socket.on("commandToArduino", function(commandNo){
        if (commandNo == "1") {
            board.digitalWrite(13, board.HIGH); // write high on pin 13
        }
        if (commandNo == "0") {
            board.digitalWrite(13, board.LOW); // write low on pin 13
        }
    });
    socket.on("blinkOn", function(){
    timer1 = setInterval(function blink() {
            board.digitalWrite(13, board.HIGH);
            timer2 = setTimeout(function () {board.digitalWrite(13, board.LOW);}, 500);
            return blink;
        }(), 1000);
    });
    socket.on("blinkOff", function(){
        clearInterval(timer1);
        clearTimeout(timer2);
    board.digitalWrite(13, board.LOW);
    });


});