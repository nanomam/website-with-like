const express = require('express');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = './like_data.json';

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (HTML, CSS, etc.)
app.use(express.static('public'));

// Initialize like count
let likeCount = 0;

// Load like count from file, if exists
fs.readFile(DATA_FILE)
    .then(data => {
        const jsonData = JSON.parse(data);
        likeCount = jsonData.likeCount || 0;
    })
    .catch(err => {
        console.error('Error reading data file:', err);
    });

// Save like count to file
const saveLikeCountToFile = async () => {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify({ likeCount }));
        console.log('Like count saved to file.');
    } catch (error) {
        console.error('Error saving like count to file:', error);
    }
};

// Endpoint to handle like button click
app.post('/like', (req, res) => {
    likeCount++;
    saveLikeCountToFile();
    res.json({ likeCount });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
