const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'hussein',
    database: 'push_pull_labs'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});


app.get('/', (req, res) => {
    res.send(`Welcome to server! <br> Try <a href="http://localhost:${PORT}/products">http://localhost:${PORT}/products</a>`);
});

app.get('/products', (req, res) => {
    // Execute a SQL query to retrieve data from the 'products' table
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Failed to retrieve products data from the database' });
            return;
        }

        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
