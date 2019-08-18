// https://developer.spotify.com/documentation/web-api/quick-start/

require("dotenv").config();
const Spotify = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var ombd_key = keys.omdb.key;


function bandsInTown(artistBandName)
{
    let bandsUrl = `https://rest.bandsintown.com/artists/${artistBandName}/events?app_id=codingbootcamp`
    axios.get(bandsUrl)
        .then(response => {
            let concertData = response.data;

            for (concert of concertData)
            {
                console.log('Venue: ' + concert.venue.name
                        + '\nLocation: ' + concert.venue.city + ', ' + concert.venue.country
                        + '\nDate: ' + moment(concert.datetime).format('MM/DD/YYYY'));
            }
        })
        .catch(error => {
            console.log('An error occured:', error);
        })
};


function omdbRequest(movieTitle)
{
    let omdbUrl = `http://www.omdbapi.com/?t=${movieTitle}&apikey=${ombd_key}`

    axios.get(omdbUrl)
        .then(response => {
            let movieData = response.data;
            let rottenTomato = '';
            for (movie of movieData.Ratings)
            {
                if (movie.Source == 'Rotten Tomatoes')
                {
                    rottenTomato = movie.Value;
                }
            }

            console.log('Title: ' + movieData.Title
                        + '\nYear: ' + movieData.Year
                        + '\nimdbRating: ' + movieData.imdbRating
                        + '\nRotten Tomatoes Rating: ' + rottenTomato
                        + '\nCountry: ' + movieData.Country
                        + '\nLanguage: ' + movieData.Language
                        + '\nPlot: ' + movieData.Plot
                        + '\nActors: ' + movieData.Actors);
        })
        .catch(error => {
            console.log('An error occured', error);
        })
};


function spotifyRequest(songName)
{
    spotify
        .search({
            type: 'track',
            query: songName,
            limit: 5
        })
        .then(response => {
            // console.log(response.tracks.items);
            let songMatches = response.tracks.items;

            for (match of songMatches)
            {
                
                console.log('Artist: ' + match.artists[0].name
                        + '\nSong Name: ' + match.name
                        + '\nLink: ' + match.href
                        + '\nAlbum: ' + match.album.name
                        + '\n')
            }

            // for (let i = 0; i < songMatches.length; i++)
            // {
            //     let songData = songMatches[i]
            //     console.log('Artist: ' + songData.artists[0]
            //                 + '\nSong Name: ' + songData.name
            //                 + '\nLink: ' + songData.href
            //                 + '\nAlbum: ' + songData.album)
            // }
        })
        .catch(error => {
            console.log('An error occured:', error);
        })
}

function liriRequest()
{
    if (process.argv.length >= 4)
    {
        // Command line arguments
        let userRequest = process.argv[2];
        let userParameters = process.argv.slice(3).join(' '); // create a string of the user arguments to pass to the APIs

        if (userRequest === 'concert-this')
        {
            bandsInTown(userParameters);
        }
        else if (userRequest == 'spotify-this-song')
        {
            spotifyRequest(userParameters);
        }
        else if (userRequest == 'movie-this')
        {
            omdbRequest(userParameters); //.replace(' ', '+')
        }
        else if (userRequest == 'do-what-it-says')
        {
            console.log('do-what-it-says');
        }
        else 
        {
            console.log('Not a valid request please type on of the following followed by a search term'
                        + 'concert-this'
                        + 'spotify-this-song'
                        + 'movie-this'
                        + 'do-what-it-says');
        }
    }  
    else 
    {
        console.log('Please type one of the following followed by a search term'
                    + 'concert-this <artist/band name here>'
                    + 'spotify-this-song <song name here>'
                    + 'movie-this <movie name here>'
                    + 'do-what-it-says');
    } 
}

liriRequest();