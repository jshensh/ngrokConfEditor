var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs=require('fs');
var exec = require('child_process').exec;

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

var yaml = require("js-yaml");

exec('killall ngrok', function(error,stdout,stderr) {
    fs.readFile('/root/ngrok.cfg','utf-8',function(err,data) {
        if (err) {
            console.log(err);
        } else {
            var loadConf=yaml.load(data), loadTunnels=[];
            for (var i in loadConf["tunnels"]) {
                loadTunnels.push(i);
            }
            exec('nohup /root/ngrok -config /root/ngrok.cfg start '+loadTunnels.join(" "),function(error,stdout,stderr) {
            });
        }
    });
});

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/commit', function(req, res) {
    console.log(req.body.tunnelsList);
    exec('killall ngrok', function(error,stdout,stderr) {
        fs.writeFile('/root/ngrok.cfg', req.body.conf, function(err) {
            if (err) {
                return console.error(err);
            }
            exec('nohup /root/ngrok -config /root/ngrok.cfg start '+req.body.tunnelsList, function(error,stdout,stderr) {
                res.send("success");
            });
        });
    });
});

app.get('/get', function(req, res) {
    fs.readFile('/root/ngrok.cfg','utf-8',function(err,data) {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        }
    });
});

app.post('/getJSON', upload.array(), function(req, res) {
    res.send(JSON.stringify(req.body) || "");
});

http.listen(34893, function(){
    console.log('listening on *:34893');
});