const {Genre} = require('../../models/genre')
const request = require('supertest')

const {User} = require('../../models/user')
let server;

describe('auth middleware', () => {

    let token
    beforeEach(() => {
         server = require('../../index')
         token = new User().generateAuthToken()
        })
    afterEach( async () => {
          await server.close()
          await Genre.remove({})  
        })
    
    const exec = () => {
       return request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: 'genre1' })
    }

    it('should return 401 if the token is not provided', async () => {
        token = ''
        const res = await exec()
        expect(res.status).toBe(401)
    })

    it('should return 400 if the token is invalid', async () => {
        token = 'a'
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it('should return 200 if the token is valid', async () => {
        const res = await exec()
        expect(res.status).toBe(200)
    })
})