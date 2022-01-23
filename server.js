let http = require("http");
let url = require("url");
let fs = require("fs");
let moment = require("moment");
const PORT = 6200;
let { Server } = require("socket.io"); 

let server = http.createServer(function (request, response){
    var path = url.parse(request.url).pathname;

    switch(path){
        case "/" :
            response.writeHead(200, {
                "Content-Type" : "text/html"                    
            });

            response.write(`<h1> Hello! </h1> 
                                <h6>Try the <a href='/test.html'>Test Page</a>
            </h6>`);

            response.end();
        break;

        case "/test.html" :
            
            fs.readFile(__dirname + path, function(error, data){
                if(error){
                    return send404(response);
                }

                response.writeHead(200, {
                    "Content-Type" : (path === "json.js") ? "text/javaScript" : "text/html"                    
                });

                response.write(data, "utf-8");
                response.end();
            });

        break;
        
        default : send404(response);
    }
});

var send404 = function(response){
    response.writeHead(404);
    response.write("404");
    response.end();
}


server.listen(PORT);


let io = new Server(server);



io.sockets.on("connection", function(socket){
    // send data to client
    
    setInterval(function(){
        let d = new Date();
        const dateString = moment(d).format("DD MMM YYYY, HH:mm:SS");
        socket.emit("date",{
            "date" : dateString
        });
    }, 1000);

    // recieve client data
    socket.on("client_data", function(data){
        process.stdout.write(data.letter);
    });
});