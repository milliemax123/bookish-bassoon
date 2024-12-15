const express = require('express');//imports express.js tp create web server
const fs = require('fs');//imports nodejs file system (FS)
const path = require('path');//nodejs path module- work with file , directory


//amelia maxwell
//ca2 web app
//23471092




const app = express();//instance 
const PORT = 3000;//defines where server runs

// middleware
app.use(express.json());//lets server handle post and put requests with json
app.use(express.static('public')); // serves static files from public folder , server provides frontedn files to brower

// file path for the creatures data
const filePath = path.join(__dirname, 'creatures.json');// absolute path to json data

// GET 
app.get('/creatures', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {//reads creature data
        if (err) {//handles errors
            console.error('Error reading file:', err);
            res.status(500).json({ message: 'Error reading data file' });//graceful error mesage for client
            return;
        }

        const jsonData = JSON.parse(data);//converts data to javascript object 
        res.json(jsonData.creatures); // send back creatures
    });
});

// POST 
app.post('/creatures', (req, res) => {// route for post requests send to creatures-clients can send new creatures
    const newCreature = req.body;//proceses data fro cliet

    fs.readFile(filePath, 'utf8', (err, data) => {// reads json file gets list
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ message: 'Error reading data file' });//if theres an error a message is sent to client
            return;
        }

        const jsonData = JSON.parse(data);//parses json data to js
        newCreature.id = jsonData.creatures.length + 1; // makes unique id for new creature by using array length +1
        jsonData.creatures.push(newCreature); // add new creature

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {//makes object js back to json string, send back string to json
            if (err) {
                console.error('Error writing to file:', err);
                res.status(500).json({ message: 'Error saving creature' });
                return;
            }

            res.status(201).json({ message: 'Creature added successfully', creature: newCreature });
        });
    });
});

// PUT editing
app.put('/creatures/:id', (req, res) => {//route for http put requests sent to creaturesid
    const creatureId = parseInt(req.params.id, 10);//takes the id makes it an integer which identifies which creature to update
    const updatedCreature = req.body;//takes new data from client in request

    fs.readFile(filePath, 'utf8', (err, data) => {//reads creature list
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ message: 'Error reading data file' });
            return;
        }

        const jsonData = JSON.parse(data);//turns json data in js object
        const creatureIndex = jsonData.creatures.findIndex(c => c.id === creatureId);//find creature with matching 1

        if (creatureIndex === -1) {//-1 dont exist
            res.status(404).json({ message: 'Creature not found' });
            return;
        }

        jsonData.creatures[creatureIndex] = { ...jsonData.creatures[creatureIndex], ...updatedCreature };//merges data of found id with new properties in updated creature- updates only filled out fields

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {//makes object back to json and returns it to json
            if (err) {
                console.error('Error writing to file:', err);
                res.status(500).json({ message: 'Error saving updated creature' });
                return;
            }

            res.status(200).json({ message: 'Creature updated successfully', creature: jsonData.creatures[creatureIndex] });
        });
    });
});

// DELETE 
app.delete('/creatures/:id', (req, res) => {// rout for delete requests for creature id
    const creatureId = parseInt(req.params.id, 10);//takes id and parses it into an integeer

    fs.readFile(filePath, 'utf8', (err, data) => {//reads json to acess creature list
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ message: 'Error reading data file' });
            return;
        }

        const jsonData = JSON.parse(data);//makes js object
        const updatedCreatures = jsonData.creatures.filter(c => c.id !== creatureId);//makes new array without creature with th ematching id

        if (updatedCreatures.length === jsonData.creatures.length) {//compares arrays lengths if the same creature wasnt found
            res.status(404).json({ message: 'Creature not found' });
            return;
        }

        jsonData.creatures = updatedCreatures;//replaces old array with new array in json data

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {//makes js object back to json string then writes it back to json
            if (err) {
                console.error('Error writing to file:', err);
                res.status(500).json({ message: 'Error saving updated data' });
                return;
            }

            console.log(`Creature with ID ${creatureId} deleted successfully.`);//sucess
            res.status(200).json({ message: 'Creature deleted successfully' });
        });
    });
});

app.get('/chart-data', (req, res) => {//route for get requets to chart data aka the bar chart
    const data = require('./creatures.json').creatures;//takes creatures array from json

    const categoryCounts = data.reduce((acc, creature) => {//reduce makes an object to count how many creatures are in each category
        acc[creature.category] = (acc[creature.category] || 0) + 1;
        return acc;
    }, {});

    res.json(categoryCounts); //sends grouped category counts tas json for chart
});


// start the server
app.listen(PORT, () => {// app.listen is clalled then epress sets up server and listens for http requests
    console.log(`Server is running at http://localhost:${PORT}`);
});
