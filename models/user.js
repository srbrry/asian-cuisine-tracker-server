const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		// field - email unique:true
		email: {
			type: String,
			required: true,
			// unique refers to if there's a doc with this already in use don't create it
			unique: true,
		},
		// hashed password results
		password: {
			type: String,
			required: true,
		},
		// notice how it's not required
		// start off without a token then save one later
		token: String,
	},
	{
		timestamps: true,
		toJSON: {
			transform: (_doc, user) => {
				delete user.password
				return user
			},
		},
	}
)

module.exports = mongoose.model('User', userSchema)
