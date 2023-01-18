const express =require('express')

const Food = require('../models/food')

const router = express.Router()

//INDEX
// GET /characters
router.get('/foods', (req, res, next) => {
    Food.find()
        .then(foods => {
            return foods.map(food => food)
        })
        .then(foods => {
            res.status(200).json({ foods: foods })
        })
        .catch(next)
})

// SHOW
// GET /characters/:id
router.get('/foods/:id', (req, res, next) => {
    Food.findById(req.params.id)
        .then(food => {
            res.status(200).json({ food: food })
        })
        .catch(next)
})

// CREATE
// POST /characters
router.post('/foods', (req, res, next) => {
    // req.body
    // food: {}
    Food.create(req.body.food)
        .then(food => {
            // top lvl of this object is character
            res.status(201).json({ food: food })
        })
        .catch(next)
})

module.exports = router