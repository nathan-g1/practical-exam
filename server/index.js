const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// global variables
const PORT = process.env.PORT || 3000;
const DB_URL = '';

app.use(cors({
    origin: ['*'],
    exposedHeaders: ['auth-token']
}));


const server = app.listen(PORT, (_) => {
    console.log(`app listening on PORT ${PORT}`);
    console.log(`Local:  http://localhost:${PORT}`);
});
