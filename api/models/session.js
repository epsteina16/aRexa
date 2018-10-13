const mongoose = require("mongoose")

const session = mongoose.Schema({
	userId: string,
	sessionId: {type: string, unique: true}
	sessionName: string,
	playlistId: string,
	danceability: {min: number, max: number},
	energy: {min: number, max: number},
	key: {min: number, max: number},
	loudness: {min: number, max: number},
	mode: {min: number, max: number},
	speechiness: {min: number, max: number},
	acousticness: {min: number, max: number},
	instrumentalness: {min: number, max: number},
	liveness: {min: number, max: number},
	valence: {min: number, max: number},
	tempo: {min: number, max: number},
	time_signature: {min: number, max: number},
	popularity: {min: number, max: number},
	songList: [string],
	artistList: [string],
	genreList: [string],
	playlist: [string]
});

module.exports = mongoose.model("Session", session);