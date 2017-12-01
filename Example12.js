var http = require("http").createServer(handler); //подключает библитоеку http
var firmata = require("firmata");
var io = require("socket.io").listen(http);
var fs=require("fs"); // variable for file  system
//var divElement = document.getElementById("print1"); // variable for div object where the values will be printed (logged)


var board = new firmata.Board("/dev/ttyACM0", function() { // ACM Abstract Control Model for serial communication with Arduino (could be USB)
    console.log("Priključitev na Arduino");
    board.pinMode(2, board.MODES.OUTPUT); // direction of DC motor
    board.pinMode(3, board.MODES.PWM); // PWM of motor i.e. speed of rotation
    board.pinMode(4, board.MODES.OUTPUT); // direction DC motor
    board.digitalWrite(2,1); // initialization of digital pin 2 to rotate Left on start
    board.digitalWrite(4,0); // initialization of digital pin 2 to rotate Left on start
});

function handler (req, res) // функция чтения файла аштиэмль
{
    fs.readFile(__dirname + "/Example12.html", 
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
        socket.on("sendPWM", function(pwm)
        {
            board.analogWrite(3,pwm);
            socket.emit("messageToClient", "PWM set to: " + pwm);        
        });
    
        socket.on("left", function(value)
        {
            board.digitalWrite(2,value.AIN1);
            board.digitalWrite(4,value.AIN2);
            socket.emit("messageToClient", "Direction: left");
        });
    
        socket.on("right", function(value)
        {
            board.digitalWrite(2,value.AIN1);
            board.digitalWrite(4,value.AIN2);
            socket.emit("messageToClient", "Direction: right");
        });
    
        socket.on("stop", function(value)
        {
            board.analogWrite(3,value);
            socket.emit("messageToClient", "STOP");
        });

        sendValueViaSocket=function (value)
        {
            io.sockets.emit("messageToClient", value);
        }
    }); // end of sockets.on connection
    
     
}); // end of board.on read




