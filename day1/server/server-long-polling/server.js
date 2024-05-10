const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON bodies

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

// app.get('/products', (req, res) => {
//     connection.query('SELECT * FROM products', (err, results) => {
//         if (err) {
//             console.error('Error executing SQL query:', err);
//             res.status(500).json({ error: 'Failed to retrieve products data from the database' });
//             return;
//         }

//         res.json(results);
//     });
// });

app.post('/products', async (req, res) => {
    const userData = req.body;

    let isDataUpdated = false;
    while (!isDataUpdated) {
        try {
            const dbData = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM products', (err, results) => {
                    if (err) {
                        console.error('Error executing SQL query:', err);
                        reject(err);
                        return;
                    }
                    resolve(results);
                });
            });
            console.log('\n\n JSON.stringify(userData.lastData): \n');
            console.log(JSON.stringify(userData.lastData));

            console.log('\n\n JSON.stringify(dbData): \n');
            console.log(JSON.stringify(dbData));
            
            if (JSON.stringify(userData.lastData) !== JSON.stringify(dbData)) {
                isDataUpdated = true;
            }

            if (isDataUpdated) {
                res.json(dbData);
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching data from the database' });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
