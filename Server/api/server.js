const express = require('express');

const app = express();
const port = 3000;

// Define routes
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

module.exports = (req, res) => {
    app(req, res);
};