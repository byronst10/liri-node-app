require("dotenv").config();

var axios = require("axios");
var bandsintown = require('bandsintown')("liri");
var moment = require("moment");
var keys = require("./keys.js");

var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify);

var userOption = process.argv[2];
var userSubject = process.argv.slice(3).join(" ");

var spotify = new Spotify({
    id: "5e981d2416154063b79283d9f1e78658",
    secret: "786ecad4bcdc48b4a90c32b7e8a4fb8c"
  });