const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// create express app
const app = express();

mongoose.connect('mongodb://localhost:27017/movies', {useNewUrlParser: true});

var movieSchema = new mongoose.Schema({
  id: Number,
  name: String
});

//Create Movie Schema
var Movie = mongoose.model('movie', movieSchema);  
  

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/movies', (req, res) => {
	
	Movie.find()
    .then(movies => {
        res.send(movies);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving movies."
        });
    });
    
});

app.post('/movies', (req, res) => {
    // Validate request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Movie Name can not be empty"
        });
    }

    // Create a Movie
    const movie = new Movie({
        id: req.body.id, 
        name: req.body.name
    });

    // Save Movie in the database
    movie.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
});

app.delete('/movies/:id', (req, res) => {

   var deleteId = req.param('id');	
   Movie.find({ id: deleteId }).remove().then( data => {
	  res.send(data);
      console.log('Movie deleted with id : ' + deleteId); 	  
   }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
});

app.put('/movies/:id', (req, res) => {

   var updateId = req.param('id');
   
  
   Movie.findOneAndUpdate({id: updateId}, req.body ).then( data => {
	   res.send(data);
       console.log('Movie updated with id: ' + updateId);
   }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
})
app.use(express.static(__dirname + '/public/prod-movie'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname));
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

