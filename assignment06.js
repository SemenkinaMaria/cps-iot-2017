var http = require("http").createServer(handler); //подключает библитоеку http
var firmata = require("firmata");
var io = require("socket.io").listen(http);
var fs=require("fs"); // variable for file  system
//var divElement = document.getElementById("print1"); // variable for div object where the values will be printed (logged)

var board = new firmata.Board("/dev/ttyACM0", function()
{ // ACM Abstract Control Model for serial communication with Arduino (could be USB)
    console.log("Connecting to Arduino");
    console.log("Activation of Pin 8");
    board.pinMode(8, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 7");
    board.pinMode(7, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Enabling analog Pin 0");
    board.pinMode(0, board.MODES.ANALOG); // analog pin 0
    console.log("Enabling analog Pin 1");
    board.pinMode(1, board.MODES.ANALOG); // analog pin 1
});

function handler (req, res) // функция чтения файла аштиэмль
{
    fs.readFile(__dirname + "/assignment06.html", 
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

var desiredValue = 0; // desired value var
var actualValue = 0;

http.listen(8080); // подключепние к порту сервера


board.on ("ready", function()
{
    board.analogRead(0, function(value) 
    {
        desiredValue = value; // continuous read of pin A0
    });
    
    board.analogRead(1, function(value) 
    {
    actualValue = value; // continuous read of pin A1
    });
    
    io.sockets.on('connection', function(socket) 
    {  // from bracket ( onward, we have an argument of the function on -> at 'connection' the argument is transfered i.e. function(socket)
        socket.emit("messageToClient", "Server connected, board ready.");
        setInterval(sendValues, 40, socket); // na 40ms we send message to client
        socket.on("commandToArduino", function(commandNo)
        {
            
            if (commandNo == "1") 
            {
                board.digitalWrite(13, board.HIGH); // write HIGH on pin 13
                board.digitalWrite(7, board.LOW); // write LOW on pin 7
                board.digitalWrite(8, board.LOW); // write LOW on pin 8
            }

            if (commandNo == "3") 
            {
                board.digitalWrite(8, board.HIGH); // write HIGH on pin 8
                board.digitalWrite(13, board.LOW); // write LOW on pin 13
                board.digitalWrite(7, board.LOW); // write LOW on pin 7
            }     

            if (commandNo == "5") 
            {
                board.digitalWrite(7, board.HIGH); // write HIGH on pin 7
                board.digitalWrite(13, board.LOW); // write LOW on pin 13
                board.digitalWrite(8, board.LOW); // write LOW on pin 8
            }
            
        });

    }); // end of socket

}); // end of board.on read


function sendValues (socket)
{
    socket.emit("clientReadValues",
    { // json notation between curly braces
    "desiredValue": desiredValue,
    "actualValue": actualValue
    });
};

