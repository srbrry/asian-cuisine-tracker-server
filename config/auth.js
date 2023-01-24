// Require the needed npm packages
const passport = require('passport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Create a secret to be used to encrypt/decrypt the token
// This can be any string value you want -- even gibberish.
const secret = process.env.JWT_SECRET || 'is your server running? well then you better go catch it'


// Require the specific `strategy` we'll use to authenticate
// Require the method that you'll use to extract the token
// from each of the requests sent by clients
const { Strategy, ExtractJwt } = require('passport-jwt')

// Minimum required options for passport-jwt
const opts = {
	// How passport should find and extract the token from
	// the request.  We'll be sending it as a `bearer` token
	// when we make requests from our front end.
	// headers: {
	// 'Accept': 'app/json',
	// 'Authorization': 'bearer ajkghjafkghadflkghjfdgl'
	// }
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	// Any secret string to use that is unique to your app
	// If you store your secrets in a config file, anybody with a github account will be able to read it, and hence it is a security risk. Storing the secrets as environment variables ensure their safe-keeping.
	secretOrKey: secret,
}

// Require the user model
const User = require('../models/user')
// getting the userSchema

// We're configuring the strategy using the constructor from passport
// so we call new and pass in the options we set in the `opts` variable.
// Then we pass it a callback function that passport will use when we call
// this as middleware.  The callback will be passed the data that was
// extracted and decrypted by passport from the token that we get from
// the client request!  This data (jwt_payload) will include the user's id!
const strategy = new Strategy(opts, function (jwt_payload, done) {
	// In the callback we run our custom code. With the data extracted from
	// the token that we're passed as jwt_payload we'll have the user's id.
	// Using Mongoose's `.findOneById()` method, we find the user in our database
	User.findById(jwt_payload.id)
		// To pass the user on to our route, we use the `done` method that
		// that was passed as part of the callback.  The first parameter of
		// done is an error, so we'll pass null for that argument and then
		// pass the user doc from Mongoose.  This adds the user to the request object
		// as request.user!
		// req.body
		// req.params
		// req.user
		.then((user) => done(null, user))
		// If there was an error, we pass it to done so it is eventually handled
		// by our error handlers in Express
		.catch((err) => done(err))
})

// STRATEGY - calling a new strategy and passing in the opts info 

// Now that we've constructed the strategy, we 'register' it so that
// passport uses it when we call the `passport.authenticate()`
// method later in our routes
passport.use(strategy)

//  registering the strategy to be used in passport.authenticate


// Initialize the passport middleware based on the above configuration!!!!!!! the code won't be usable UNLESS you initialize and invoke
passport.initialize()

// Create a variable that holds the authenticate method so we can
// export it for use in our routes
// users have to be signed in to hit the create routes
const requireToken = passport.authenticate('jwt', { session: false })

// Create a function that takes the request and a user document
// and uses them to create a token to send back to the user
const createUserToken = (req, user) => {
	// Make sure that we have a user, if it's null that means we didn't
	// find the email in the database.  If there is a user, make sure
	// that the password is correct.  For security reason, we don't want
	// to tell the client whether the email was not found or that the
	// password was incorrect.  Instead we send the same message for both
	// making it much harder for hackers.
	if (
		!user ||
		!req.body.credentials.password ||
		!bcrypt.compareSync(req.body.credentials.password, user.password)
	) {
		const err = new Error('The provided username or password is incorrect')
		err.statusCode = 422
		// the server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions. for example you put in the wrong username or password
		throw err
	}
	// If no error was thrown, we create the token from user's id and
	// return the token
	return jwt.sign({ id: user._id }, secret, { expiresIn: 36000 })
}

// a token is being us 

//

module.exports = {
	requireToken,
	createUserToken,
}
