// command center
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const db = require('./config/db')
const PORT = 2001

const foodRoutes = require('./routes/food-routes')
const requestLogger = require('./lib/request-logger')
const foodSeed = require('./lib/food-seed')

// deprecation warning
mongoose.set('strictQuery', true)

// creates the connection between your local MongoDB and this express app
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// starting an express app
const app = express()

app.use(cors({ origin: `http://127.0.0.1:5502` }))

// sending json 
// need to be able to accept json
app.use(express.json())

app.use(requestLogger)

// server needs to know about this router!!!
app.use(foodRoutes)
app.use('/seed', foodSeed)

app.listen(PORT, () => {
    console.log('listening on ' + PORT)
})

module.exports = app