const mongoose = require("mongoose")

const songs = mongoose.Schema({
	sessionId: {type: String, unique: true},
	userId: String,
	songs: [{
		songId: String,
		danceability: Number,
		energy: Number,
		key: Number,
		loudness: Number,
		mode: Number,
		speechiness: Number,
		acousticness: Number,
		instrumentalness: Number,
		liveness: Number,
		valence: Number,
		tempo: Number,
		time_signature: Number,
		popularity: Number,
		like: Boolean
	}]
	//list of songs
});

module.exports = mongoose.model("Songs", songs);