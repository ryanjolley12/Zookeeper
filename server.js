// require express.js
const express = require('express');
const { animals } = require('./data/animals');

// instantiates the server 
const app = express();

// add the route for animals
app.get('/api/animals', (req, res) => {
    res.send('Hello!')
});
// get() method always requires two arguments ("string that describes thee route"; callback function)
// send() method from res (response) parameter to send string "Hello!" to client 

// chain listen() method on to server 
app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
  });