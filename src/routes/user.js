const { Router } = require('express')
const passport = require('passport')
const { User } = require('../../src/model')
const auth = require('./middleware/auth')

router = new Router()

router.get('/:id', auth.required, async (req, res) => {
    let { id } = req.params
    var response = await User.findById(id)
        .then(d => {
            return {
                id: d.id,
                name: d.name,
                email: d.email,
                lastActiveTime: d.lastActiveTime
            }
        })
        .catch(e => {
            return {
                user: null,
                success: false,
                message: 'User not found'
            }
        })
    res.send(response)
})

router.post('/login', auth.optional, async (req, res, next) => {

    const { body: { email, password } } = req

    if (!email || !password) {
        return res.status(422).json({
            errors: {
                msg: "All fields (email, password) are required"
            }
        })
    }


    return passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err)
        }

        if (!user) {
            return res.json(info)
        }

        user.token = user.generateJWT()
        return res.json({ user: user.toAuthJSON() })
    })(req, res, next)

})

router.post('/signup', auth.optional, async (req, res) => {
    const { body: { name, email, password } } = req

    if (!name || !email || !password) {
        return res.json({
            errors: {
                msg: "All fields (name, email, password) are required"
            }
        })
    }

    const userExists = await User.findOne({ email }).count() > 0
    if (userExists) {
        return res.json({
            errors: {
                msg: "user with that email already exists."
            }
        })
    }

    const user = new User({ name, email, password })
    user.setPassword(password)
    user.save((err, user) => {
        if (err) {
            return res.send({ err: err.errmsg })
        }

        return res.send({ user: user.toAuthJSON() })
    })
})

module.exports = router
