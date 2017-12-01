var http = require("http"); //подключает библитоеку http
var firmata = require("firmata");

var board = new firmata.Board("/dev/ttyACM0", function(){// ACM (Abstract Control Model) for serial communication with Arduino (could be USB)
    board.pinMode(12, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output. определяет порт с которым будем работать
});

http.createServer(function(req, res){ // http.createServer([requestListener]) | The requestListener is a function which is automatically added to the 'request' event.
    var parts = req.url.split("/"), // split request url on "/" character
    operator = parseInt(parts[1],10); // 10 is radix - decimal notation; the base in mathematical numeral systems (from 2 to 36)
        
    if (operator == 555) {
        board.digitalWrite(12, board.LOW);
    }
    else if (operator == 1) {
        board.digitalWrite(12, board.HIGH);
    }
        
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("Do not play with me! \n");
    res.end("The value of operator: " + operator);
}).listen(8080, "172.16.22.228");