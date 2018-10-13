const mongoose = require("mongoose")

const session = mongoose.Schema({
	userId: string,
	sessionId: string,
	//current parameters
});

module.exports = mongoose.model("Session", session);