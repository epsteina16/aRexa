const mongoose = require("mongoose")

const songs = mongoose.Schema({
	sessionId: string,
	userId: string,
	//list of songs
});

module.exports = mongoose.model("Songs", songs);