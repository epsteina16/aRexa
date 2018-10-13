const mongoose = require("mongoose")

const session = mongoose.Schema({
	userId: String,
	sessionId: {type: String, unique: true},
	sessionName: String,
	playlistId: String,
	danceability: {min: Number, max: Number},
	energy: {min: Number, max: Number},
	key: {min: Number, max: Number},
	loudness: {min: Number, max: Number},
	mode: {min: Number, max: Number},
	speechiness: {min: Number, max: Number},
	acousticness: {min: Number, max: Number},
	instrumentalness: {min: Number, max: Number},
	liveness: {min: Number, max: Number},
	valence: {min: Number, max: Number},
	tempo: {min: Number, max: Number},
	time_signature: {min: Number, max: Number},
	popularity: {min: Number, max: Number},
	songList: [String]
});

module.exports = mongoose.model("Session", session);