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

					
				} else {
					// error
				}
			});
			//send response to alexa
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
			const playlist_id;

			//get track audio features

			options.url = "https://api.spotify.com/v1/audio-features/" + track_id;
			request(options, function(err, resp, bod) {
				if (!err && resp.statusCode == 200) {
					const track_data = JSON.parse(bod);
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
				var new_options {
					url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks",
	  				headers: {
	    			'Authorization': spotifyToken
	  				}
				};
				var tracks = {tracks: []};
				for (var i = req.body.session.playlist.indexOf(track_uri); i < req.body.session.playlist.length(); i++) {
					curr_uri = req.body.session.playlist[i];
					tracks.tracks.push({"uri": curr_uri});
				}

				new_options.url;
				new_options.body = JSON.stringify(tracks);
				request(new_options, function(error_del, response_del, body_del) {
					if (!error_del && response_del.statusCode == 200) {
						var paramaters = {
					danceability: (Math.random() * (req.body.session.danceability.max - req.body.session.danceability.min) + req.body.session.danceability.min),
					energy: (Math.random() * (req.body.session.energy.max - req.body.session.energy.min) + req.body.session.energy.min),
					key: (Math.random() * (req.body.session.key.max - req.body.session.key.min) + req.body.session.key.min),
					loudness: (Math.random() * (req.body.session.loudness.max - req.body.session.loudness.min) + req.body.session.loudness.min),
					mode: (Math.random() * (req.body.session.mode.max - req.body.session.mode.min) + req.body.session.mode.min),
					speechiness: (Math.random() * (req.body.session.speechiness.max - req.body.session.speechiness.min) + req.body.session.speechiness.min),
					acousticness: (Math.random() * (req.body.session.acousticness.max - req.body.session.acousticness.min) + req.body.session.acousticness.min),
					instrumentalness: (Math.random() * (req.body.session.instrumentalness.max - req.body.session.instrumentalness.min) + req.body.session.instrumentalness.min),
					liveness: (Math.random() * (req.body.session.liveness.max - req.body.session.liveness.min) + req.body.session.liveness.min),
					valence: (Math.random() * (req.body.session.valence.max - req.body.session.valence.min) + req.body.session.valence.min),
					tempo: (Math.random() * (req.body.session.tempo.max - req.body.session.tempo.min) + req.body.session.tempo.min),
					time_signature: (Math.random() * (req.body.session.time_signature.max - req.body.session.time_signature.min) + req.body.session.time_signature.min),
					popularity: (Math.random() * (req.body.session.popularity.max - req.body.session.popularity.min) + req.body.session.popularity.min)
				}


				var query_string = "?limit=5&";
				Object.keys(parameters).forEach(function(key) {
					var val = parameters[key];
					query_string += ("target_" + key + "=" + val);
				});


				if (req.body.session.songList.length >= 1) {
					query_string += "&seed_tracks=";
					for (var i = 0; i < req.body.session.songList.length(); i++) {
						if (i != 0) {
							query_string += "%";
						}
						query_string += req.body.session.songList[i];
					}
				}
				if (req.body.session.artistList.length >= 1) {
					query_string += "&seed_artists=";
					for (var i = 0; i < req.body.session.artistList.length(); i++) {
						if (i != 0) {
							query_string += "%";
						}
						query_string += req.body.session.artistList[i];
					}
				}
				if (req.body.session.genreList.length >= 1) {
					query_string += "&seed_genres=";
					for (var i = 0; i < req.body.session.genreList.length(); i++) {
						if (i != 0) {
							query_string += "%";
						}
						query_string += req.body.session.genreList[i];
					}
				}


				options.url = "https://api.spotify.com/v1/recommendations" + query_string;
				request(options, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						const data = JSON.parse(body);
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
						var new_options = {
						  	url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks",
						  	headers: {
						    	'Authorization': spotifyToken
						  	}
						};
						for (var i = 0; i < 5; i++) {
							const curr_uri = data.tracks[i].track_uri;
							req.body.session.playlist.push(curr_uri);
							new_options.body = JSON.stringify([curr_uri]);
							request.post(new_options, function(play_error, play_response, play_body) {
								if (!play_error && play_response.statusCode == 200){
									// send response to alexa
									res.send({
											    "play_body": {
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
								else {
									//error
								}
						});
						}
					}
					else {
						//error
					}
				});
				}
				else {
					//error
				}
			});
		});				
		} else {
			// error
		}

	});


	//****Run PCA on data and do shit****

	//get Recommendations


	// update parameters
	// get new recs from parameters, check songs not in songs list, update queue
});
	


module.exports = router;