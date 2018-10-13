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

router.post('/next', function(req, res) {
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
			return res.send("Success");
		} else {
			console.log(error);
			console.log(response);
			return res.status(500).send(error);
		}
	});
});


router.post('/addToPlaylist', function(req, res) {
	const sessionId = req.body.session.sessionId;
	const playlist_name = req.body.request.intent.slots.PlaylistName.value;

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

			options.url = "https://api.spotify.com/v1/me/playlists";

			request(options, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					const playlists = (JSON.parse(body)).items;
					const playlist_id = "";
					for (var i = 0; i < playlists.length; i++) {
						if (playlists[i].name === playlist_name) {
							playlist_id = playlists[i].id;
							break;
						}
					}

					if (playlist_id !== "") {
						options.url = "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks";
						options.body = JSON.parse([track_uri]);

						request.post(options, function(error, response, body){
							if (!err && response.statusCode == 200){
								return res.send("Success");
							}
						});


					} else {
						return res.send("Playlist not found");

					}
				} else {
					//error
				}
			});
		} else {
			//error
		}
	});
});


module.exports = router;