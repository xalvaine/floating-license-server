const express = require('express');
const cors = require('cors');
const server = express();

const csvFilePath = './fls-data.csv';
const csv = require('csvtojson');

server.use(cors());

let data;

csv()
    .fromFile(csvFilePath)
    .then(jsonObj => data = jsonObj);

server.get('/', (req, res) => res.send(JSON.stringify(data)));
server.listen(5000, () => console.log('Server ready'));