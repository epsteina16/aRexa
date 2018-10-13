const mongoose = require("mongoose")

const songs = mongoose.Schema({
	sessionId: string,
	userId: string,
	songs: [{
		songId: string,
		danceability: number,
		energy: number,
		key: number,
		loudness: number,
		mode: number,
		speechiness: number,
		acousticness: number,
		instrumentalness: number,
		liveness: number,
		valence: number,
		tempo: number,
		time_signature: number,
		like: boolean
	}]
	//list of songs
});

module.exports = mongoose.model("Songs", songs);