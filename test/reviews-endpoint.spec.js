const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const fixtures = require('./reviews.fixtures');
const { makeReviewsArray, makeMaliciousReview } = require('./reviews.fixtures');
const { makePlantsArray } = require('./plants.fixtures');

describe('reviews endpoint', function() {
  let db;

  before('make new knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from database', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE reviews, plants RESTART IDENTITY CASCADE'));

  afterEach('clean up after each test', () => db.raw('TRUNCATE reviews, plants RESTART IDENTITY CASCADE'));

  describe('GET /api/reviews', () => {
    context('given no reviews', () => {
      it('responds 200 and an empty array', () => {
        return supertest(app)
          .get('/api/reviews')
          .expect(200, [])
      })
    })
    context('given reviews exist', () => {
        const testPlants = makePlantsArray();
        const testReviews =makeReviewsArray();
      beforeEach('insert reviews', () => {
        return db.into('plants').insert(testPlants)
          .then( () => {
            return db.into('reviews').insert(testReviews);
          });
      });
      
      it('responds 200 and returns an array of reviews', () => {
        return supertest(app)
          .get('/api/reviews')
          .expect(200, testReviews);
      });
    });
    context('given an XSS attack review', () => {
      const testPlants = makePlantsArray();
      const {maliciousReview, expectedReview } = makeMaliciousReview()

      beforeEach('insert plants and reviews', () => {
        return db
        .into('plants')
        .insert(testPlants)
          .then( () => {
            return db.into('reviews').insert([maliciousReview])
          });
      });
      it('malicious review inserted, return sanitized review', () => {
        return supertest(app)
          .get('/api/reviews')
          .expect(200)
            .expect(res => {
            expect(res.body[0].rating).to.eql(expectedReview.rating)
            expect(res.body[0].content).to.eql(expectedReview.content)
             })
      });
    });
  });

  describe(`GET /api/reviews/:reviewid`, () => {
    context('given review with ID does not exist', () => {
      it('responds 404', () => {
        const reviewid = 123456
        return supertest(app)
          .get(`/api/reviews/${reviewid}`)
          .expect(404, { error: { message: `Review doesn't exist` }});
      })
    })
    context('given review ID does exist', () => {
      const testPlants = makePlantsArray();
      const testReviews = makeReviewsArray();
      beforeEach('insert test plants and reviews', () => {
        return db
        .into('plants').insert(testPlants)
          .then( () => {
            return db
            .into('reviews').insert(testReviews);
          });
      });
      it('given review with ID does exist, respond with 200 and correct review', () => {
        const reviewid = 2
        const expectedReview = testReviews[reviewid - 1]
        return supertest(app)
          .get(`/api/reviews/${reviewid}`)
          .expect(200, expectedReview);
      });
    });
    context('given an XSS attack review', () => {
      const testPlants = makePlantsArray();
      const {maliciousReview, expectedReview} = makeMaliciousReview();
      beforeEach('insert plants and reviews', () => {
        return db
        .into('plants')
        .insert(testPlants)
          .then( () => {
            return db
            .into('reviews').insert([maliciousReview]);
          });
      });
      it('malicious review inserted, return sanitized review', () => {
        return supertest(app)
          .get(`/api/reviews/${maliciousReview.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.content).to.eql(expectedReview.content)
          })
      });
    });

  });

  describe(`DELETE /api/reviews/:reviewid`, () => {
    context('given review with ID does not exist', () => {
      it('responds 404', () => {
        const reviewid = 123456
        return supertest(app)
        .delete(`/api/reviews/${reviewid}`)
          .expect(404, { error: { message: `Review doesn't exist` }});
      })
    })
    context('given review ID does exist', () => {
      const testPlants = makePlantsArray();
      const testReviews = makeReviewsArray();
      beforeEach('insert test plants and reviews', () => {
        return db.
        into('plants')
        .insert(testPlants)
          .then(() => {
            return db
            .into('reviews')
            .insert(testReviews);
          })
      })
      it('responds 204, deletes review', () => {
        const idToRemove = 2;
        const expectedReview = testReviews.filter(review => review.id !== idToRemove);
        return supertest(app)
          .delete(`/api/reviews/${idToRemove}`)
          .expect(204)
          .then(res => 
            supertest(app)
          .get(`/api/reviews`)
          .expect(expectedReview))
      });
    });
  });
});