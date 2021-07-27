// require express.js
const express = require('express');
const { animals } = require('./data/animals.json');
// tells app to use port 3001, not Heroku's 80
const PORT = process.env.PORT || 3001;
// instantiates the server 
const app = express();
//---------------------------------------------------------------------------------------------------------------------------------------------

// add the route for animals ---> get() method always requires two arguments ("string that describes thee route"; callback function), send() method from res (response) parameter to send string "Hello!" to client 
// app.get('/api/animals', (req, res) => {
//     res.json('Hello!')
// });
  // *** RUN NPM START AND THEN NAVIGATE TO http://localhost:3001/api/animals on browser to see HELLO!
//---------------------------------------------------------------------------------------------------------------------------------------------

// app.get('/api/animals', (req, res) => {
//     res.json(animals);
// });

  // *** RUN NPM START AND THEN NAVIGATE TO http://localhost:3001/api/animals on browser to see ANIMALS.JSON!
  //---------------------------------------------------------------------------------------------------------------------------------------------
// specify results using params --> access query property on the req object
// app.get('/api/animals', (req, res) => {
//     let results = animals;
//     console.log(req.query)
//     res.json(results);
//   });
  // *** RUN NPM START AND THEN NAVIGATE TO http://localhost:3001/api/animals?name=Erica on browser to see an object with the property name and value 'Erica' in terminal (turned into JSON)

//---------------------------------------------------------------------------------------------------------------------------------------------
// FILTER FUNCTIONALITY INSIDE OF GET()
// function filterByQuery(query, animalsArray) {
//     let filteredResults = animalsArray;
//     if (query.diet) {
//       filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
//     }
//     if (query.species) {
//       filteredResults = filteredResults.filter(animal => animal.species === query.species);
//     }
//     if (query.name) {
//       filteredResults = filteredResults.filter(animal => animal.name === query.name);
//     }
//     return filteredResults;
//   }

// filterByQuery takes in req.query as an arguments and filters thru animals accordingly, returning new filtered array 

//---------------------------------------------------------------------------------------------------------------------------------------------
// modify filterByQuery() to handle personalityTraits array 
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
  }

// http://localhost:3001/api/animals?personalityTraits=hungry&personalityTraits=zany see only zany traits 

//---------------------------------------------------------------------------------------------------------------------------------------------

// call the filterByQuery() in the app.get() callback 

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });
 
// *** RUN NPM START AND THEN NAVIGATE TO http://localhost:3001/api/animals?name=Erica on browser to see an object with the property name and value 'Erica'

// chain listen() method on to server 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

