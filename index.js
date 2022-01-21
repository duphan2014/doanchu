var cron = require('node-cron');
const fs = require("fs");
const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening

var buffer = fs.readFileSync("tudien7.csv");
var tudienString = buffer.toString();
var tudien = tudienString.split(',');

function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}


var wordToday="hải sản";

cron.schedule('0 0 0 * * *', () => {
	wordToday=tudien[between(0, tudien.length)];
  	console.log('running a task at midnight everyday');
  	console.log("word today: "+wordToday);
});

app.use(express.static(__dirname + '/public'));

//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
             
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile          
	res.cookie('da', wordToday);
	
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});