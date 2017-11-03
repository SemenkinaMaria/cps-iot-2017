var http = require("http").createServer(handler); //подключает библитоеку http + добавляем создание сервера
var firmata = require("firmata");
var io = require("socket.io").listen(http); // socket.io for permanent connection between server and client
var fs=require("fs"); // variable for file  system

var board = new firmata.Board("/dev/ttyACM0", function(){ // ACM Abstract Control Model for serial communication with Arduino (could be USB)
    console.log("Connecting to Arduino");
    console.log("Activation of Pin 8");
    board.pinMode(8, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 7");
    board.pinMode(7, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 12");
    board.pinMode(12, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
});
function handler (req, res) // функция чтения файла аштиэмль
{
    fs.readFile(__dirname + "/assignment04.html", 
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

io.sockets.on("connection", function(socket) // функция распознования команд
    {
        socket.on("commandToArduino", function(commandNo){
        if (commandNo == "0") {
            board.digitalWrite(13, board.LOW); // write LOW on pin 13
        }
        if (commandNo == "1") {
            board.digitalWrite(13, board.HIGH); // write HIGH on pin 13
        }
        if (commandNo == "2") {
            board.digitalWrite(8, board.LOW); // write LOW on pin 8
        }
        if (commandNo == "3") {
            board.digitalWrite(8, board.HIGH); // write HIGH on pin 8
        }     
        if (commandNo == "4") {
            board.digitalWrite(7, board.LOW); // write LOW on pin 7
        }
        if (commandNo == "5") {
            board.digitalWrite(7, board.HIGH); // write HIGH on pin 7
        }
        if (commandNo == "6") {
            board.digitalWrite(12, board.LOW); // write LOW on pin 12
        }
        if (commandNo == "7") {
            board.digitalWrite(12, board.HIGH); // write HIGH on pin 12
        }     
        if (commandNo == "8") {
            board.digitalWrite(12, board.LOW); // write LOW on pin 12
            board.digitalWrite(13, board.LOW); // write LOW on pin 
            board.digitalWrite(8, board.LOW); // write LOW on pin 8
            board.digitalWrite(7, board.LOW); // write LOW on pin 7
             
        }
        if (commandNo == "9") {
            board.digitalWrite(12, board.HIGH); // write HIGH on pin 12
            board.digitalWrite(13, board.HIGH); // write HIGH on pin 13
            board.digitalWrite(7, board.HIGH); // write HIGH on pin 7
            board.digitalWrite(8, board.HIGH); // write HIGH on pin 8
        }    
    });
});
