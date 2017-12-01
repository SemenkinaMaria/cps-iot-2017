var http = require("http").createServer(handler); //подключает библитоеку http
var firmata = require("firmata");
var io = require("socket.io").listen(http);
var fs=require("fs"); // variable for file  system
//var divElement = document.getElementById("print1"); // variable for div object where the values will be printed (logged)

var board = new firmata.Board("/dev/ttyACM0", function(){ // ACM Abstract Control Model for serial communication with Arduino (could be USB)
    console.log("Connecting to Arduino");
    console.log("Enabling Push Button on pin 2");
    board.pinMode(2, board.MODES.INPUT);
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
});

function handler (req, res) // функция чтения файла аштиэмль
{
    fs.readFile(__dirname + "/Example701.html", 
    function (err, data) 
    {
        if (err)
        {
            res.writeHead(500, {"Content-Type":"text/plain"});
            return res.end("Error loading html page");
        }
        res.writeHead(200);
        return res.end(data);
    });
}     
http.listen(8080); // подключепние к порту сервера

var sendValueViaSocket = function (){};

board.on ("ready", function()
{
   
    io.sockets.on("connection", function(socket) // функция распознования команд
    {
        console.log ("Socket id:" +socket.id);
        socket.emit ("messageToClient", "Srv connected, board OK");
        sendValueViaSocket=function (value)
        {
            io.sockets.emit("messageToClient", value);
        }
    }); // end of sockets.on connection
    
    
    board.digitalRead(2, function(value) 
    {
        if (value == 0) 
        {
            console.log("LED OFF");
            board.digitalWrite(13, board.LOW);
            sendValueViaSocket(0);
           //console.log("Value = 0");
            //io.sockets.emit("messageToClient", "Value = 0");
        }
        if (value == 1) 
        {
            console.log("LED ON");
            board.digitalWrite(13, board.HIGH);
           sendValueViaSocket(1);
            //console.log("Value = 1");
           //io.sockets.emit("messageToClient", "Value = 1");
        }
    }); //end of board.digitalRead
    
}); // end of board.on read





