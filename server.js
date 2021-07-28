// fs library and Node API path --> provides utilities for working with files && directory paths
const fs = require('fs');
const path = require('path');

// require express.js
const express = require('express');
const { animals } = require('./data/animals.json');
// tells app to use port 3001, not Heroku's 80
const PORT = process.env.PORT || 3001;
// instantiates the server 
const app = express();

// Parse Incoming Data for server to accept POST request:

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());

// both of the app.use middleware functions are needed when server accepts POST data
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

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
  }
//---------------------------------------------------------------------------------------------------------------------------------------------
// NEW CREATE ANIMALS FUNCTION: accepts POST route's req.body value and array for the data
// new animal --> added to imported animals array from animals.json (doesn't actually change the content of the imported file but reades data and makes a copy for server.js)

// function createNewAnimal(body, animalsArray) {
//     const animal = body;
//     animalsArray.push(animal);

//     // return finished code to post route for response 
//     return animal;
// }
// function executed within app.post() route's callback; takes new animal data and adds it to animalsArray; writes new array data to animals.json
//---------------------------------------------------------------------------------------------------------------------------------------------

// updated createNewAnimal() to write to animals.json

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync( // doesnt require callback function 
        path.join(__dirname, './data/animals.json'), // joins value of directory with path to the animals.json file 
        JSON.stringify({ animals: animalsArray }, null, 2) // saves JS array data as JSON; null: don't edit any existing data; 2: create white space bw values for readability
    );

    // return finished code to post route for response 
    return animal;
}

//---------------------------------------------------------------------------------------------------------------------------------------------
// ADD VALIDATION 
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false; 
    }

if (!animal.species || typeof animal.species !== 'string') {
    return false;
}

if (!animal.diet || typeof animal.diet !== 'string') {
    return false; 
}
if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false
}
return true;
}

// call the filterByQuery() in the app.get() callback 

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

// a param route must come after the other get routee
app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
    res.json(result);
});

// send a 404 if no record exists
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });
 
// *** RUN NPM START AND THEN NAVIGATE TO http://localhost:3001/api/animals?name=Erica on browser to see an object with the property name and value 'Erica'
//---------------------------------------------------------------------------------------------------------------------------------------------

// app.post('/api/animals', (req, res) => {
//     // req.body is where our incoming content will be 
//     console.log(req.body);
//     res.json(req.body);
// });
//---------------------------------------------------------------------------------------------------------------------------------------------
// update POST routes callback to generate new animal IDs: 
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be 
    req.body.id = animals.length.toString(); // ID created based on Array length--> don't remove any data from animals.json 

    // if any data in req.body is incorrect, send 400 error back 
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted')
    } else {
    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
    }
});

// chain listen() method on to server 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

