// https://developer.spotify.com/documentation/web-api/quick-start/

require("dotenv").config();

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
