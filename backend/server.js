const express = require('express');
const fileUpload = require('express-fileupload');
const { fstat } = require("fs");
const fs = require('fs');
const path = require('path');


const app = express();
const port = 9000;

app.use(express.json())
app.use(fileUpload());

const pathToFrontend = path.join(`${__dirname}/../frontend`)
app.use('/public', express.static(`${pathToFrontend}/public`))

/* ----- GET request to get the index.hml */
app.get('/', (req, res) => {
    res.sendFile(`${pathToFrontend}/index.html`)
});

/* ----- GET request to get the data.json for swiper-slides*/
app.get('/image-list', (req, res) => {
    res.sendFile(`${pathToFrontend}/data.json`)
})

/* ----- POST request for uploading new file and data */
app.post('/post', (req, res) => {
    const picture = req.files.picture;
    picture.mv(path.join(`${__dirname}/../frontend/public/img/${req.body.filename}`))

    const existingTitles = JSON.parse(fs.readFileSync(`${__dirname}/../frontend/data.json`));
    const newTitle = req.body;
    existingTitles.push(newTitle);

    const stringifyTitles = JSON.stringify(existingTitles)
    fs.writeFileSync(`${__dirname}/../frontend/data.json`, stringifyTitles)

    res.send('successfully added')
})

/* ----- DELETE request for removing pictures and its data */
app.delete('/delete', (req, res) => {
    
    /* ----- get the filename of the picture to remove */
    const filenameToDelete = req.body.filename;
    
    /* ----- removing the picture */
    fs.unlinkSync(path.join(`${__dirname}/../frontend/public/img/${filenameToDelete}`))
    
    /* ---- get the data of titles and filter */
    const allTitles = fs.readFileSync(`${__dirname}/../frontend/data.json`)
    const allTitlesJSON = JSON.parse(allTitles)
    const allTitlesJSONFiltered = allTitlesJSON.filter(title => title.filename !== filenameToDelete)
    const stringifyFilteredTitles = JSON.stringify(allTitlesJSONFiltered)
    fs.writeFileSync(`${__dirname}/../frontend/data.json`, stringifyFilteredTitles)
    // console.log(req.body.filename);
    res.send('sziszi')
})

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
});