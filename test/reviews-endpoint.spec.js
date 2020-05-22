const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

const { makeReviewsArray } = require('./reviews.fixtures');
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

  after('disconnect from database', () => db.destroy() );

  before('clean the table', () => db.raw('TRUNCATE reviews, plants RESTART IDENTITY CASCADE'));

  afterEach('clean up after each test', () => db.raw('TRUNCATE reviews, plants RESTART IDENTITY CASCADE'));

  describe('GET /api/reviews', () => {
    context('given no reviews', () => {
      it('responds 200 and an empty array', () => {
        return supertest(app)
          .get('/api/reviews')
          .expect(200, []);
      });
    });
    context('given reviews exist', () => {
      const testPlants = makePlantsArray();
      const testReviews = makeReviewsArray();
      beforeEach('insert plants', () => {
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
      const maliciousReview = {
        content: 'Naughty naughty very naughty <script>alert("xss");</script>',
        id: 1,
        rating: 1,
        plantId : 1
          };
      const expectedReview = {
        content: 'Naughty naughty very naughty <script>alert("xss");</script>',
        id: 1,
        rating: 1,
        plantId: 1
       
      };
      beforeEach('insert plants and reviews', () => {
        return db.into('plants').insert(testPlants)
          .then( () => {
            return db.into('reviews').insert(maliciousReview)
          });
      });
      it('malicious review inserted, return sanitized review', () => {
        return supertest(app)
          .get('/api/reviews')
          .expect(200, [expectedReview]);
      });
    });
  });

  describe('GET /api/reviews/:reviewId', () => {
    context('given review with ID does not exist', () => {
      it('responds 404', () => {
        return supertest(app)
          .get('/api/reviews/999')
          .expect(404);
      });
    });
    context('given review ID does exist', () => {
      const testPlants = makePlantsArray();
      const testReviews = makeReviewsArray();
      const expectedId = 1;
      const expectedReview = testReviews[expectedId - 1];
      beforeEach('insert test plants and reviews', () => {
        return db.into('plants').insert(testPlants)
          .then( () => {
            return db.into('reviews').insert(testReviews);
          });
      });
      it('given review with ID does exist, respond with 200 and correct review', () => {
        return supertest(app)
          .get(`/api/reviews/${expectedId}`)
          .expect(200, expectedReview);
      });
    });
    context('given an XSS attack review', () => {
      const testPlants = makePlantsArray();
      const maliciousReview = {
        content: 'Naughty naughty very naughty <script>alert("xss");</script>',
        id: 1,
        rating: 1,
        plantId: 1
      };
      const expectedReview = {
        content: 'Naughty naughty very naughty <script>alert("xss");</script>',
        id: 1,
        rating: 1,
        plantId: 1
      };
      beforeEach('insert plants and reviews', () => {
        return db.into('plants').insert(testPlants)
          .then( () => {
            return db.into('reviews').insert(maliciousReview);
          });
      });
      it('malicious review inserted, return sanitized review', () => {
        return supertest(app)
          .get('/api/reviews/1')
          .expect(200, expectedReview);
      });
    });

  });

  describe('DELETE /api/reviews/:reviewId', () => {
    context('given review with ID does not exist', () => {
      it('responds 404', () => {
        return supertest(app)
          .get('/api/reviews/999')
          .expect(404);
      });
    });
    context('given review ID does exist', () => {
      const testPlants = makePlantsArray();
      const testReviews = makeReviewsArray();
      beforeEach('insert test plants and reviews', () => {
        return db.into('plants').insert(testPlants)
          .then( () => {
            return db.into('reviews').insert(testReviews);
          });
      });
      it('responds 204, deletes review', () => {
        const idToRemove = 1;
        const expectedReviews = testReviews.filter(review => review.id !== idToRemove);
        return supertest(app)
          .delete(`/api/reviews/${idToRemove}`)
          .expect(204)
          .then( () => {
            return supertest(app)
              .get('/api/reviews')
              .expect(expectedReviews);
          });
      });
    });
  });
});