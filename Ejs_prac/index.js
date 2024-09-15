const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) {
            return res.status(500).send("Error reading directory");
        }
        res.render('index', { files: files });
    });
});

app.post("/create", (req, res) => {
    let title = req.body.title.split(" ").map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join("");

    const filePath = path.join(__dirname, 'files', `${title}.txt`);


    fs.writeFile(filePath, `${req.body.details}`, (err) => {
        if (err) {
            return res.status(500).send("Error creating file");
        }
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
