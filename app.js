const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const app = express();
const connection = mysql.createConnection({
  host: '157.20.241.21',
  user: 'papaCODER',
  password: 'Akhil178@',
  database: 'akhil122'
});

connection.connect((err) => {
  if (err) {
    console.error('Bhaisahab Database connect nahi ho paa raha h : ' + err.stack);
    return;
  }
  console.log('Bhaisahab database connect hogya h : ' + connection.threadId);
});

app.get('/', (req, res) => {
  connection.query('SELECT * FROM movies', (error, results) => {
    if (error) throw error;
    res.render('index.ejs', { movies: results });
  });
});

app.get('/anime', (req, res) => {
  connection.query('SELECT * FROM Anime', (error, results) => {
    if (error) throw error;
    res.render('anime.ejs', { movies: results });
  });
});

app.get('/bollywood', (req, res) => {
  connection.query('SELECT * FROM bollywood ',  (error, results) => {
    if (error) throw error;
    res.render('bollywood.ejs', { movies: results });
  });
});

app.get('/hollywood', (req, res) => {
  connection.query('SELECT * FROM movies WHERE category = ?', ['Hollywood'], (error, results) => {
    if (error) throw error;
    res.render('hollywood.ejs', { movies: results });
  });
});

app.get('/southmovies', (req, res) => {
  connection.query('SELECT * FROM movies WHERE category = ?', ['South Movies'], (error, results) => {
    if (error) throw error;
    res.render('southmovies.ejs', { movies: results });
  });
});
app.get('/movie-details/:id', (req, res) => {
    const movieId = req.params.id;

    let tableName;

    // Determine the appropriate table name based on the movie ID
    if (movieId.startsWith('A')) {
        tableName = 'Anime';
    } else if (movieId.startsWith('B')) {
        tableName = 'bollywood';
    } else if (movieId.startsWith('H')) {
        tableName = 'hollywood';
        // Add any additional conditions for Hollywood movies if needed
    } else if (movieId.startsWith('S')) {
        tableName = 'southmovies';
        // Add any additional conditions for South Movies if needed
    } else {
        res.status(400).send('Invalid movie ID');
        return;
    }

    const query = `SELECT * FROM ${tableName} WHERE id = ?`;

    connection.query(query, [movieId], (error, results) => {
        if (error) throw error;

        if (results.length === 0) {
            res.send('Movie not found');
        } else {
            const movie = results[0];

            res.render('movie-details.ejs', { selectedMovie: movie });
        }
    });
});

app.set('view engine', 'ejs');
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});