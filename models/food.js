const mongoose = require('mongoose')

const Schema = mongoose.Schema

const foodSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		countryOfOrigin: {
			type: String,
			required: true,
		},
		isVegan: {
			type: Boolean,
			required: true,
		},
        minutesToCook: {
            type: Number,
            required: true,
            min: 1,
            max: 90
        }
	},
	{
        timestamps: true
    }
)

// mongosh collection characters
const Food = mongoose.model('Food', foodSchema)

module.exports = Food