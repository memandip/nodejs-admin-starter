const expressJwt = require('express-jwt')
const { secret } = require('../../config/constants')

const auth = {
    required: expressJwt({
        secret,
        userProperty: 'payload'
    }),
    optional: expressJwt({
        secret,
        userProperty: 'payload',
        credentialsRequired: false
    })
}

module.exports = auth