const express = require("express");
const request = require("request");
const router = express.Router();

const spotifyToken = require("./oauth");
var authToken = undefined;

router.use(function(req, res, next) {
	spotifyToken().then(function(v) {
		authToken = v;
		console.log(authToken)
		next();
	});
})


const Songs = require("./models/songs");
const Session = require("./models/session");

const songActions = require("./song_action_controller");

router.use('/', function(req, res, next) {
	console.log("In songs");

	next();
});

router.use(songActions);


//like endpoint
router.post('/like', function(req, res) {
	const sessionId = req.body.session.sessionId;


	var options = {
	  url: "https://api.spotify.com/v1/me/player/currently-playing",
	  headers: {
	    'Authorization': 'Bearer ' + authToken
	  },
	  json: true
	};

	request(options, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			const data = JSON.parse(body);
			const track_id = data.item.id;
			const track_uri = data.item.uri;
			const popularity = data.item.popularity;
			const playlist_id = undefined;

			//get track audio features

			options.url = "https://api.spotify.com/v1/audio-features/" + track_id;
			request(options, function(err, response, body) {
				if (!err && response.statusCode == 200) {
					const track_data = JSON.parse(body);
					const song = {
						songId: track_id,
						danceability: track_data.danceability,
						energy: track_data.energy,
						key: track_data.key,
						loudness: track_data.loudness,
						mode: track_data.mode,
						speechiness: track_data.speechiness,
						acousticness: track_data.acousticness,
						instrumentalness: track_data.instrumentalness,
						liveness: track_data.liveness,
						valence: track_data.valence,
						tempo: track_data.tempo,
						time_signature: track_data.time_signature,
						popularity: popularity,
						like: true
					}
					const songs = Songs.findOne({sessionId: sessionId}, function(err, foundSongs) {
						if (!err && foundSongs) {
							foundSongs.songs.push(song);
							foundSongs.save(function(err, savedObj) {
								if (err) {
									//error
								}
							});
						} else {
							//error
						}
					});

					const sessionInfo = Session.findOne({sessionId: sessionId}, function(err, foundSession) {
						if (!err && foundSession) {
							playlist_id = foundSession.playlistId;
							foundSession.songList.push(track_id);
							foundSession.save(function(err, savedObj) {
								if (err) {
									//error
								}
							});
						}
					});

					// add to playlist
					options.url = "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks";
					options.body = JSON.stringify([track_uri]);

					request.post(options, function(err, response, body) {
						if (!err && response.statusCode == 200){
							// send response to alexa
							res.send({
									    "body": {
									        "version": "1.0",
									        "response": {
									            "outputSpeech": {
									                "type": "PlainText",
									                "text": ""
									            },
									            "card": {
									                "type": "Simple",
									                "title": "",
									                "content": ""
									            },
									            "reprompt": {
									                "outputSpeech": {
									                    "type": "PlainText",
									                    "text": ""
									                }
									            },
									            "shouldEndSession": value
									        }
									    }
									});
						}
					});
				} else {
					// error
				}
			});


		} else {
			// error
		}
	});
});


//dislike endpoint
router.post('/dislike', function(req, res) {
	const sessionId = req.body.session.sessionId;


	var options = {
	  url: "https://api.spotify.com/v1/me/player/next",
	  headers: {
	    'Authorization': 'Bearer ' + authToken
	  },
	  json: true
	};

	request(options, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			const data = JSON.parse(body);
			const track_id = data.item.id;
			const track_uri = data.item.uri;
			const popularity = data.item.popularity;

			//get track audio features

			options.url = "https://api.spotify.com/v1/audio-features/" + track_id;
			request(options, function(err, response, body) {
				if (!err && response.statusCode == 200) {
					const track_data = JSON.parse(body);
					const song = {
						songId: track_id,
						danceability: track_data.danceability,
						energy: track_data.energy,
						key: track_data.key,
						loudness: track_data.loudness,
						mode: track_data.mode,
						speechiness: track_data.speechiness,
						acousticness: track_data.acousticness,
						instrumentalness: track_data.instrumentalness,
						liveness: track_data.liveness,
						valence: track_data.valence,
						tempo: track_data.tempo,
						time_signature: track_data.time_signature,
						popularity: popularity,
						like: true
					}
					const songs = Songs.findOne({sessionId: sessionId}, function(err, foundSongs) {
						if (!err && foundSongs) {
							if (!foundSongs.songs.includes(song)) {
								song.like = false;
								foundSongs.songs.push(song);
								foundSongs.save(function(err, savedObj) {
									if (err) {
									//error
								}
								});
							}
							else {
								const index = foundSongs.songs.indexOf(song);
								foundSongs.songs[index].like = false;
							}
						} else {
							//error
						}
					});
				}
				res.send({
						    "body": {
						        "version": "1.0",
						        "response": {
						            "outputSpeech": {
						                "type": "PlainText",
						                "text": ""
						            },
						            "card": {
						                "type": "Simple",
						                "title": "",
						                "content": ""
						            },
						            "reprompt": {
						                "outputSpeech": {
						                    "type": "PlainText",
						                    "text": ""
						                }
						            },
						            "shouldEndSession": value
						        }
						    }
						});
			});
		} else {
			// error
		}
	});

	// check song is not there add song to db
	// update parameters
	// get new recs from parameters, check songs not in songs list, update queue
});
	


module.exports = router;