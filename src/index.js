const express = require('express');
const weather = require('./routes');
const app = express();

var cors = require('cors');

app.use(cors());

//init midlleware
app.use(express.json({ extended: false }));

//Define routes
app.use('/api/weather', weather);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT} `));
