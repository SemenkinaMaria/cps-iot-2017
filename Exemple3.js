var http = require("http"); //подключает библитоеку http
var firmata = require("firmata");

var board = new firmata.Board("/dev/ttyACM0", function(){ // ACM Abstract Control Model for serial communication with Arduino (could be USB)
    console.log("Connecting to Arduino");
    console.log("Activation of Pin 8");
    board.pinMode(8, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
});
http.createServer(function(req, res){ // http.createServer([requestListener]) | The requestListener is a function which is automatically added to the 'request' event.
    var parts = req.url.split("/"), // split request url on "/" character
    operator = parseInt(parts[1],10), // 10 is radix - decimal notation; the base in mathematical numeral systems 
    operator2 = parseInt(parts[2],10); // 10 is radix - decimal notation;
       res.writeHead(200, {"Content-Type": "text/plain"});     
if (operator == 0) {
   console.log("Putting led to G OFF");
   board.digitalWrite(13, board.LOW);
   res.write("Do not play with Green! You OFF it \n");
   
}
if (operator == 1) {
   console.log("Putting led G ON");
   board.digitalWrite(13, board.HIGH);
   res.write("Do not play with Green! You ON it \n");
}
if (operator2 == 0) {
   console.log("Putting led B OFF");
   board.digitalWrite(8, board.LOW);
   res.write("Do not play with BLUE! You OFF it \n");
}
if (operator2 == 1) {
   console.log("Putting led B ON");
   board.digitalWrite(8, board.HIGH);
   res.write("Do not play with BLUE! You ON it \n");
}



   // res.writeHead(200, {"Content-Type": "text/plain"});

    res.write("The value of operator: " + operator);
     res.write("\n");
      res.end("The value of operator2: " + operator2);
}).listen(8080, "172.16.22.228");