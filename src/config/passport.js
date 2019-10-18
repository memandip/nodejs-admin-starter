const passport = require('passport')

const LocalStrategyUser = require('passport-local')
const { User } = require('../../src/model')

passport.use(new LocalStrategyUser({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    User.findOne({ email })
        .then((user) => {
            if (!user || !user.validatePassword(password)) {
                return done(null, false, {
                    errors: { msg: 'email or password is invalid' }
                })
            }
            return done(null, user)
        })
        .then(done)
}))