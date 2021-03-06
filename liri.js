// initialize dot evnv
require("dotenv").config();

//import dependency files
const keys = require("./keys.js");
const fs = require('fs')
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require('axios')
const moment = require('moment')


// Hold user action
let action = process.argv[2]

// //User Options
switch (action) {
     case "concert-this":
          searchConcert();
          break;

     case "spotify-this-song":
          searchMusic();
          break;

     case "movie-this":
          searchMovie();
          break;

     case "do-what-it-says":
         readFromFile();
          break;

     default:
         console.log('Please provide and instruction')
}
//Concert API
function searchConcert() {
     let artist = (process.argv).slice(3)
    
     artist = artist.join('+')

     //Check the userinput
     if (artist) {
          artist = artist         
     } else {
          artist = 'saves the day'
     }


     // request bandsinTown API
     let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

     // This line is just to help us debug against the actual URL.
     console.log(queryUrl);

     axios.get(queryUrl).then(
          function (response) {

               //Bandintown response  
               let res = response.data[0]
               //format date
               let date = moment(res.datetime).format("MM/DD/YYYY")

               // display response
               let result = 
               `
          Name of the Venue:   ${res.venue.name}
          Venue Location:      ${res.venue.city}, ${res.venue.region}, ${res.venue.country}
          Date of the Event:   ${date}
          `
          console.log(result)
           //Save the Concert Name to the log file
           addTofile(result)
          }
     );
}


//OMBD movie request and response
function searchMovie() {
     let movieName = (process.argv).slice(3)
  
     movieName = movieName.join('+')

     //Check to make input
     if (movieName) {
          movieName = movieName
        
     } else {
          movieName = 'Mr. Nobody'
     }


     // request OMBD API
     let queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

     // This line is just to help us debug against the actual URL.
     console.log(queryUrl);

     axios.get(queryUrl).then(
          function (response) {

               //OMDB RESPONSE    
               let result = 
               `
        Title:        ${response.data.Title}
        Year:         ${response.data.Year}
        IMDB Rating:  ${response.data.imdbRating}
        RT. Rating:   ${response.data.Rated}
        Country:      ${response.data.Country}
        Language:     ${response.data.Language}
        Plot:         ${response.data.Plot}
        Actors:       ${response.data.Actors}
        Poster:       ${response.data.Poster}
        `
        console.log(result)
         //Save the Concert Name to the log file
         addTofile(result)
          }
     );
}


//Spotify Song
function searchMusic(songName) {
     songName = (process.argv).slice(3)
 
     songName = songName.join('+')

     //Check to make input
     if (songName) {
          songName = songName
          
     } else {
          songName = 'The Sign'
     }
     function song(){
     spotify
          .search({
               type: 'track',
               query: songName,
               limit: 1
          })
          .then(function (response) {
               let resp = response.tracks.items[0]

      let result = 
      `
     Artist(s):          ${resp.album.artists[0].name}

     Song's name:        ${resp.name}

     Spotify Preview:    ${resp.preview_url}

     Album:              ${resp.album.name}
         `
         console.log(result)
         //Save the Concert Name to the log file
         addTofile(result)
          })
          // The album that the song is from:${response.tracks.album.name}
          .catch(function (err) {
               console.log(err);
          });
     }song()

}
//Read from File
let songNameread;
function readFromFile(){
fs.readFile('random.txt', 'utf8', (err, data) => {
     if (err) {
          console.log(err)
     }
    songNameread = data
})
}


//Append File
let i = 1
function addTofile(evt){
    
     fs.appendFile('log.txt', i + ' '+ evt + '\n...............................................\n', err => {
          if (err) {
               console.log(err)
          }   
          console.log('Add Successful')    
         
     })
     i++
     }

     
    
