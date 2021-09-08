const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const pinRoutes = require('./routes/pin');
const userRoutes = require('./routes/user');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const dbUrl = process.env.MONGO_URL;
const PORT = process.env.PORT || 8800;

mongoose.connect(dbUrl, 
        {useNewUrlParser : true,
        useUnifiedTopology : true,
        useCreateIndex : true,
        useFindAndModify : true
        }).then(() => console.log('Database connection established'))
        .catch(err => console.log('Error connecting to database' + err.message));


app.use('/api/pin', pinRoutes);
app.use('/api/user', userRoutes);


app.listen(PORT, () => {

        console.log('Backend server started');

})