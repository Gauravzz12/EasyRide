const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes.js');
const cors=require('cors');
require('dotenv').config(); 

const app = express();
app.use(cors());
const PORT =  5000;

mongoose.connect("mongodb+srv://gaurav1234thakurgt:1234@easyride.hv31can.mongodb.net/CabBooking?retryWrites=true&w=majority&appName=EasyRide/CabBooking", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

app.use('/', routes);
app.use('/location', routes);
app.use('/cabs', routes);
app.use('/cabs/update/:id', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
