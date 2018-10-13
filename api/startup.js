const express = require('express');
const app = express();

const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/arexa');

const song_controller = require('./api/song_controller');
app.use("/songs", song_controller);

app.post("/initialize", function(req, res) {
    res.outputSpeech.text = "Welcome to aRexa! Would you like to start a new session or resume from an existing session?";
});

app.post("/start", function(req, res) {
    if (req.request.intent.name == "start_new") {
        res.outputSpeech.text = "Where should we get started?";
        res.which = "start";
    }
    else if (req.request.intent.name == "resume_existing") {
        res.which = "resume";
        res.outputSpeech.text = "Which session should we resume?";
    }
    else 
        res.which = "reprompt";
        res.outputSpeech.text = "I didn't understand that. Please try again.";
});


app.listen(3000, () => {
    console.log('The application is running on localhost 3000');
});