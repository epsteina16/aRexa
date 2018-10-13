const express = require('express');
const app = express();

const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/arexa');

const song_controller = require('./api/song_controller');
app.use("/songs", song_controller);

const spotify_token = require('./api/oauth').headers.Authorization;

app.get("/", function(req, res) {
	res.send("Suh dude");
});

app.listen(3000, () => {
    console.log('The application is running on localhost 3000');
    console.log(spotify_token);
});