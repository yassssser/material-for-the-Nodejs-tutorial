const { User } = require('../../../models/user')
const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')

describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = { 
            _id: new mongoose.Types.ObjectId().toHexString(),
             isAdmin: true
            }
        const user = new User(payload)
        const token = user.generateAuthToken()
        // jwt.verify(token, config.get('jwtPrivetKey'))
        const decoded = jwt.verify(token, 'project_jwtPrivetKey')
        expect(decoded).toMatchObject(payload)
    })
})