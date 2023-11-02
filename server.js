const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

// /api/authors
app.use('/api/authors', require('./api/authors.js'));

// /api/books
app.use('/api/books', require('./api/books.js'));

const PORT = 3000

// Simple error handling middleware
app.use((err, req, res, next)=> {
  console.error(err);
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal server error.';
  res.status(status).json({message});
});

app.listen(PORT, () => {
  console.log('Listening! URL: http://localhost:' + PORT);
});