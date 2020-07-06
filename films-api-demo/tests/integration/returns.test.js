const moment = require('moment')
const {User} = require('../../models/user')
const {Rental} = require('../../models/rental')
const {Movie} = require('../../models/movie')
const request =  require('supertest')
const mongoose = require('mongoose')

let server;
let rental
let movie
let customerId;
let movieId
let token

describe('/api/returns', () => {

    const exec = () => {
        return request(server)
                    .post('/api/returns')
                    .set('x-auth-token', token)
                    .send({ customerId, movieId })
    }

    beforeEach( async () => {

        customerId = mongoose.Types.ObjectId()
        movieId = mongoose.Types.ObjectId()
        token = new User().generateAuthToken()

         server = require('../../index')

         movie = new Movie({
             _id: movieId,
             title: 'title movie',
             genre: { name: 'genre1'},
             dailyRentalRate: 5,
             numberInStock: 10
         })
         await movie.save()

          rental = new Rental({
            customer: {
                _id: customerId,
                name: 'yasweb',
                phone: '123456789'
            },
            movie: {
                _id: movieId,
                title: 'title movie',
                dailyRentalRate: 5
            }
         })
          await rental.save()
        })

        afterEach(async () => { 
            await server.close(); 
            await Rental.remove({});
            await Movie.remove({});
          });  
 
    it('should return 401 if the client is not logged in', async () => {
        token = ''
        const res = await exec()
        expect(res.status).toBe(401)
    })

    it('should return 400 if the customerId is not provided', async () => {
        customerId = ''
        const res = await exec()

        expect(res.status).toBe(400)
    })

    it('should return 400 if the movieId is not provided', async () => {
        movieId = ''
        const res = await exec()

        expect(res.status).toBe(400)
    })

    it('should return 404 if no rental was found for the customer/movie id', async () => {
        await Rental.remove({})

        const res = await exec()

        expect(res.status).toBe(404)
    })

    it('should return 400 if the rental was already processed', async () => {
        rental.dateReturned = new Date()
        await rental.save()

        const res = await exec()

        expect(res.status).toBe(400)
    })

    it('should return 200 if we have a valid request', async () => {
        const res = await exec()

        expect(res.status).toBe(200)
    })

    it('should set the returnedDate if the request is valid', async () => {
        const res = await exec()

        const  rentalInDb = await Rental.findById(rental._id)
        const diff = new Date() - rentalInDb.dateReturned
        expect(diff).toBeLessThan(10 * 1000)
    })

    it('should set the rentalFee if the request is valid', async () => {

        rental.dateOut = moment().add(-7, 'days').toDate()
        await rental.save()

        const res = await exec()

        const  rentalInDb = await Rental.findById(rental._id)
        expect(rentalInDb.rentalFee).toBe(35)
    })

    it('should increase the movie in stock if the request is valid', async () => {
        const res = await exec()

        const  movieInDb = await Movie.findById(movieId)
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1)
    })
    
    it('should return the rental object if the request is valid', async () => {
        const res = await exec()

        const  rentalInDb = await Rental.findById(rental._id)
        // expect(res.body).toHaveProperty('dateOut')
        // expect(res.body).toHaveProperty('dateReturned')
        // expect(res.body).toHaveProperty('rentalFee')
        // expect(res.body).toHaveProperty('customer')
        // expect(res.body).toHaveProperty('movie')

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'])
        )

    }) 
})