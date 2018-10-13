const express = require('express');
const app = express();

const mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
//mongoose.connect('mongodb://localhost/arexa');

//const song_controller = require('./api/song_controller');
//app.use("/songs", song_controller);

app.post("/initialize", function(req, res) {
    res.send("Welcome to aRexa! Would you like to start a new session or resume from an existing session?");
});

app.post("/start", function(req, res) {
    var information = new Object();
    //res.send(req.body);
    console.log(req.body);
    const body = req.body;
    if (body.request.intent.name == "start_new") {
        information.text = "Where should we get started?";
        information.which = "start";
        res.send(JSON.stringify(information));
    }
    else if (body.request.intent.name == "resume_existing") {
        information.which = "resume";
        information.text =  "Which session should we resume?";
        res.send(JSON.stringify(information));
    }
    else {
        information.which = "reprompt";
        information.text = "I didn't understand that. Please try again.";
        res.send(JSON.stringify(information));
    }
});


app.listen(3000, () => {
    console.log('The application is running on localhost 3000');
});