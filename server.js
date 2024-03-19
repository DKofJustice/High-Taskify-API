const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
require('dotenv').config()
const userAuthRoutes = require('./routes/userAuth')
const taskRoutes = require('./routes/taskRoute')

const app = express()

//Middleware
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_STRING);

//Routes for registering and logging users in
app.use(userAuthRoutes);

//Routes for handling tasks
app.use(taskRoutes);

//Creating Server
app.listen(8089, () => {
    console.log('server started...')
})