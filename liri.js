require("dotenv").config();

var axios = require("axios");
var bandsintown = require("bandsintown")("liri");
var moment = require("moment");
var fs = require("fs");

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var userOption = process.argv[2];
var userSearch = process.argv.slice(3).join(" ");

function liriRun(userOption, userSearch) {
  switch (userOption) {
    case "spotify-this-song":
      getSpotify(userSearch);
      break;

    case "concert-this":
      getBandsInTown(userSearch);
      break;

    case "movie-this":
      getOMDB(userSearch);
      break;

    case "do-what-it-says":
      getRandom();
      break;
    //If userOption is null, a default message will be returned to the user
    default:
      console.log(
        "Please enter one of the following commands: 'spotify-this-song', 'concert-this', 'movie-this', 'do-what-it-says' "
      );
  }
}

function getSpotify(songName) {
  var spotify = new Spotify(keys.spotify);
  //console.log(Spotify key: " + spotify);

  if (!songName) {
    songName = "I Want It That Way";
  }
  //console.log("SongName if not a song name: " + songName);

  spotify.search({ type: "track", query: songName }, function(err, data) {
    if (err) {
      return console.log("Error occured: " + err);
    }

    console.log(
      "Artist(s) Name: " + data.tracks.items[0].album.artists[0].name + "\r\n"
    );
    console.log("Song Name: " + data.tracks.items[0].name + "\r\n");
    console.log("Song Preview Link: " + data.tracks.items[0].href + "\r\n");
    console.log("Album: " + data.tracks.items[0].album.name + "\r\n");

    var logSong =
      "Start Spotify Log Entry" +
      "\nArtist: " +
      data.tracks.items[0].album.artist[0].name +
      "\r\n";
    fs.appendFile("log.txt", logSong, function(err) {
      if (err) throw err;
    });
  });
}

function getBandsInTown(artist) {
  var artist = userSearch;
  var bandQueryURL =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";

  axios.get(bandQueryURL).then(function(response) {
    console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
    console.log("Venue Location: " + response[0].venue.city + "\r\n");
    console.log(
      "Date of event: " +
        moment(response.data[0].datetime).format("MM-DD-YYYY") +
        "\r\n"
    );

    var logConcert = "Musician: " + artist + "\nName of the Venue: ";

    fs.appendFile("log.txt", logConcert, function(err) {
      if (err) throw err;
    });
  });
}

function getOMDB(movie) {

        //If movie entry is null, "Mr. Noboby" will be selected as the default movie.
        if(!movie) {
            movie = "Mr. Nobody";
        }

        var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
        //console.log(movieQueryUrl);
        axios.request(movieQueryUrl).then(
            function(response) {
                console.log("* Title: " + response.data.Title + "\r\n");
                console.log("* Year Released: " + response.data.Year + "\r\n");
                console.log("* IMDB Rating: " + response.data.imdbRating + "\r\n");
                console.log("* Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
                console.log("* Country Where Produced: " + response.data.Country + "\r\n");
                console.log("* Language: " + response.data.Language + "\r\n");
                console.log("* Plot: " + response.data.Plot + "\r\n");
                console.log("* Actors: " + response.data.Actors + "\r\n");

                var logMovie = "\nMovie" + response.data.Title + "\nYear released: ";

                fs.appendFile("log.txt", logMovie, function (err) {
                    if (err) throw err;
                });

            });
        };

        function getRandom() {
            fs.readfile("random.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error);

                } else {
                    console.log(data);

                    var randomData = data.split(",")
                    liriRun(randomData[0], randomData[1]);
                }

            });
        };

        function logResults(data) {
            fs.appendfile("log.txt", data, function (err) {
                if (err) throw err;
            });

        };

        liriRun(userOption, userSearch);