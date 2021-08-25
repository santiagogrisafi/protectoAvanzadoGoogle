require('../config/config.js');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const colors = require('colors');
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((express.static(path.resolve(__dirname, '../public'))));

app.use(require('../routes/index'));

mongoose.connect(process.env.MongoURI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }, (err, conexion) => {
    if (err) {
        console.log(err);
    }
    console.log('Conectado a la base de datos en el pierto 27017'.green);
});

app.listen(process.env.PORT, () => {
    console.log('Listen Port :'.green + process.env.PORT);
});