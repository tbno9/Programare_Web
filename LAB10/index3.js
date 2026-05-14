var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get('/', function (req, res) {
 res.sendFile('index3.html', { root: __dirname });
});

app.post('/user', function (req, res) {
 console.log(req.method + ' ' + req.url);
 console.log(req.body);
//  res.send('data received');

 let imagineSelectata = req.body.imagineCeruta;
 
 if (imagineSelectata) {
     //nume fisier trimis spre client   
    console.log("se trimite imagine: " + imagineSelectata);
    res.send(imagineSelectata);
 }
 else
    res.send("eroare.svg");

});

var server = app.listen(8001, function () {
 console.log('Node server is running..');
});