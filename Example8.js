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
    fs.readFile(__dirname + "/Example8.html", 
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
    
          
      //    if(msg==1)
         //    {
//ctx.fillStyle = "#00ff00";
         //    }
        //    else
       //     {
       //        ctx.fillStyle = "#ff0000";
        //    }
    var timeout = false;
    var last_value=0;
    var last_sent=1;
    board.digitalRead(2, function(value) 
    { // this happens many times on digital input change of state 0->1 or 1->0
        if (timeout !== false) 
        { // if timeout below has been started (on unstable input 0 1 0 1) clear it
	        clearTimeout(timeout); // clears timeout until digital input is not stable i.e. timeout = false
        }
        timeout = setTimeout(function() 
        { // this part of code will be run after 50 ms; if in-between input changes above code clears it
            console.log("Timeout set to false");
            timeout = false;
            if (last_value != last_sent)
            { // to send only on value change
        	    if (value == 0) 
        	    {
                    console.log("LED OFF");
                     board.digitalWrite(13, board.LOW);
                     console.log("value = 0, LED OFF");
                 }
                else if (value == 1) 
                {
                        console.log("LED ON");
                     board.digitalWrite(13, board.HIGH);
                     console.log("value = 1, LED lit");
                 }
                io.sockets.emit("messageToClient", value);
             }

            last_sent = last_value;
        }, 50); // execute after 50ms
                
        last_value = value; // this is read from pin 2 many times per s
                
    }); // end board.digitalRead on pin 2
    
}); // end of board.on read




