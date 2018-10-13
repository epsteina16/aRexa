const express = require('express');
const app = express();

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/arexa');

const song_controller = require('./api/song_controller');
app.use("/songs", song_controller);

const spotify_token = require('./api/oauth');

app.get("/", function(req, res) {
	res.send("Suh dude");
});

app.listen(3000, () => {
    console.log('The application is running on localhost 3000');
    spotify_token().then(function(v) {
		console.log(v)
	});
});