const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;

app.use(express.json());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(port,()=>{
    console.log(`Backend is running on http://localhost:${port}`);
})

app.get('/', (req, res) => {
    res.send('Hello World!')
});


const userRoute = require('./Routes/User');
app.use('/user', userRoute);

const blogRoute = require('./Routes/Blog');
app.use('/blog',blogRoute);

mongoose.connect(process.env.MONGO_URI,)
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
}
);