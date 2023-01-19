const express = require('express')

const router = express.Router()

const Food = require('../models/food')

const startingFoods = [
	{
		name: 'Bibimbap',
		countryOfOrigin: 'Korea',
		isVegan: false,
		minutesToCook: 80,
	},
	{
		name: 'Pad Thai',
		countryOfOrigin: 'Thailand',
		isVegan: false,
		minutesToCook: 60,
	},
	{
		name: 'Nigiri',
		countryOfOrigin: 'Japan',
		isVegan: false,
		minutesToCook: 5,
	},
]

// /seed/characters
router.get('/foods', (req, res, next) => {
    Food.deleteMany({})
        .then(() => {
            Food.create(startingFoods)
                .then(foods => {
                    res.status(200).json({ foods: foods })
                })
        })
        .catch(next)
})

module.exports = router