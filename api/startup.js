const express = require('express');
const app = express();

const mongoose = require('mongoose');
const session = require('session');
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
    var info = new Object();

    const body = req.body;
    if (body.intent.name == "start_new") {
        info.outputSpeech = "Where should we get started?";
        res.send(JSON.stringify(info));
    } else if (body.intent.name == "resume_existing") {
        info.outputSpeech =  "Which session should we resume?";
        res.send(JSON.stringify(info));
    } else {
        info.outputSpeech = "I didn't understand that. Please try again.";
        res.send(JSON.stringify(info));
    }
});

app.post("/start_new", function(req, res) {
    var info = new Object();
    const body = req.body;

    var new_sessionID = body.session.sessionID;
    var new_session = new session({sessionID: new_sessionID});
    
    if (body.intent.name == "new_song") {
        var artist = body.intent.slots.Artist.value;
        $.get("https://api.spotify.com/v1/search?q=" + artist + "&type=artist&limit=1", function(data){
            var song = body.intent.slots.Song.value;
            $
            $.get("https://api.spotify.com/v1/recommendations?seed_artists")
        })
        

    } else if (body.intent.name == "new_artist") {
        var artist = body.intent.slots.Artist.value;

    } else if (body.intent.name == "new_genre") {
        var genre = body.intent.slots.Genre.value;

    } else {
        info.outputSpeech = "I didn't understand that. Please try again.";
        res.send(JSON.stringify(info));
    }

});


app.listen(3000, () => {
    console.log('The application is running on localhost 3000');
});