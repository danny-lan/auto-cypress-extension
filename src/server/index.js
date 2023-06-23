const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const BASE_PATH = '/Users/erichan/instabase/webserver/shared/src/js/webpacked';  

// Endpoint to get file content
app.get('/file', (req, res) => {
    let { filePath } = req.query;

    if (!filePath) {
        return res.status(400).send('Missing file path');
    }

    // Resolve the path to the base directory
    filePath = path.join(BASE_PATH, filePath);

    // Ensure the resolved path still points to a location inside the base directory
    if (!filePath.startsWith(BASE_PATH)) {
        return res.status(400).send('Invalid file path');
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred while reading the file.');
        }
        res.set('Content-Type', 'text/plain');
        return res.send(data);
    });
});

// Endpoint to write to a file
app.post('/file', (req, res) => {
    let { filePath, content } = req.body;

    if (!filePath || !content) {
        return res.status(400).send('Missing file path or content');
    }

    // Resolve the path to the base directory
    filePath = path.join(BASE_PATH, filePath);

    // Ensure the resolved path still points to a location inside the base directory
    if (!filePath.startsWith(BASE_PATH)) {
        return res.status(400).send('Invalid file path');
    }

    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred while writing to the file.');
        }
        return res.send('File was written successfully.');
    });
});

app.listen(3010, () => console.log('Server is listening on port 3010'));
