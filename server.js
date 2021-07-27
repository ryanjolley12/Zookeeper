// require express.js
const express = require('express');
const { animals } = require('./data/animals.json');

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
app.get('/api/animals', (req, res) => {
    let results = animals;
    console.log(req.query)
    res.json(results);
  });
  // *** RUN NPM START AND THEN NAVIGATE TO http://localhost:3001/api/animals?name=Erica on browser to see an object with the property name and value 'Erica' in terminal (turned into JSON)


// chain listen() method on to server 
app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
  });

