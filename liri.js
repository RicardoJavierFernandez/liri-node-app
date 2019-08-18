// https://developer.spotify.com/documentation/web-api/quick-start/

require("dotenv").config();

const Spotify = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var ombd_key = keys.omdb.key;

// Command line argument
var userRequest = process.argv[2];

// Call the Bands In Town API and return concert information
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
                        + '\nDate: ' + moment(concert.datetime).format('MM/DD/YYYY')
                        + '\n');
            }
        })
        .catch(error => {
            console.log('An error occured:', error);
        })
};

// Call the OMDb API and return movie information
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
                        + '\nActors: ' + movieData.Actors
                        + '\n');
        })
        .catch(error => {
            console.log('An error occured', error);
        })
};

// Call the Spotify API and return song information
function spotifyRequest(songName)
{
    spotify
        .search({
            type: 'track',
            query: songName,
            limit: 5
        })
        .then(response => {
            let songMatches = response.tracks.items;

            for (match of songMatches)
            {   
                console.log('Artist: ' + match.artists[0].name
                        + '\nSong Name: ' + match.name
                        + '\nLink: ' + match.href
                        + '\nAlbum: ' + match.album.name
                        + '\n');
            }
        })
        .catch(error => {
            console.log('An error occured:', error);
        })
};

// Reads a text file with a default request to the Spotify API and returns song information
function doWhatItIs()
{
    fs.readFile('./random.txt', 'utf-8', (error, data) => {
        if (error) 
        {
            console.log('An error occured:', error);
        }
        else
        {
            let request = data.split(',');
            liriRequest(request[0], request[1]);
        }
    });
};

// Main function that makes the application work
function liriRequest(request)
{    
    if (process.argv.length >= 4)
    {
        // Create a string of the user arguments to pass to the APIs
        let userParameters = process.argv.slice(3).join(' '); 

        if (request === 'concert-this')
        {
            bandsInTown(userParameters);
        }
        else if (request == 'spotify-this-song')
        {
            spotifyRequest(userParameters);
        }
        else if (request == 'movie-this')
        {
            omdbRequest(userParameters);
        }
        else 
        {            
            console.log('Not a valid request please type on of the following commands followed by a search term:'
                        + '\n concert-this <artist/band name here>'
                        + '\n spotify-this-song <song name here>'
                        + '\n movie-this <movie name here>'
                        + '\n do-what-it-says');
        }
    }  
    else 
    {
        if (request === 'concert-this')
        {
            console.log('Looks like you are missing the name of the artist/band. Please try again with an artist/band name.');
        }
        else if (request == 'spotify-this-song')
        {
            spotifyRequest('The Sign by Ace of Base');
        }
        else if (request == 'movie-this')
        {
            console.log('Looks like you are missing the name of a movie. Please try again with a movie name.');
        }
        else if (request == 'do-what-it-says')
        {
            doWhatItIs();
        }
        else 
        {
            console.log('Please type one of the following commands followed by a search terms:'
            + '\n concert-this <artist/band name here>'
            + '\n spotify-this-song <song name here>'
            + '\n movie-this <movie name here>'
            + '\n do-what-it-says');
        }
    } 
};


liriRequest(userRequest);
