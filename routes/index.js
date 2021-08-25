const express = require('express');
const app = express();

app.use(require('./login'));
app.use(require('./user'));
app.use(require('./google'));

module.exports = app;