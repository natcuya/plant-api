  
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makePlantsArray } = require('./plants.fixtures');

describe('plants endpoint', function() {
  let db;

  before('make new knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from database', () => db.destroy() );

  before('clean the table', () => db.raw('TRUNCATE  reviews, plants RESTART IDENTITY CASCADE'));

  afterEach('cleanup after each test', () => db.raw('TRUNCATE reviews, plants RESTART IDENTITY CASCADE'));

  describe('GET /api/plants', () => {
    context('given no plants', () => {
      it('responds 200 and an empty array', () => {
        return supertest(app)
          .get('/api/plants')
          .expect(200, []);
      });
    });
    context('given plants exist', () => {
      const testPlants = makePlantsArray();
      beforeEach('insert plants', () => {
        return db.into('plants')
          .insert(testPlants);
      });
      it('responds 200 and returns array of plants', () => {
        return supertest(app)
          .get('/api/plants')
          .expect(200, testPlants);
      });
    });
    context('given an XSS attack plant', () => {
      const maliciousPlant = {
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        id: 1,
        content: 'Naughty naughty very naughty <script>alert("xss");</script>',
        img: 'Naughty naughty very naughty <script>alert("xss");</script>'
      };
      const expectedPlant = {
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        id: 1,
        content: 'Naughty naughty very naughty <script>alert("xss");</script>',
        img: 'Naughty naughty very naughty <script>alert("xss");</script>'
      };
      beforeEach('insert plants', () => {
        return db.into('plants')
          .insert(maliciousPlant);
      });
      it('malicious plant inserted, return sanitized plant', () => {
        return supertest(app)
          .get('/api/plants')
          .expect(200, [expectedPlant]);
      });
    });
  });
  describe('GET /api/plants/:plantId', () => {
    context('given plantId does not exist', () => {
      it('responds 404', () => {
        return supertest(app)
          .get('/api/plants/999')
          .expect(404);
      });
    });
    context('given plantId exists', () => {
      const testPlants = makePlantsArray();
      const expectedId = 2;
      const expectedPlant = testPlants[expectedId - 1];
      beforeEach('insert test plants', () => {
        return db.into('plants').insert(testPlants);
      });
      it('given plantId exists, respond with 200 and correct plant', () => {
        return supertest(app)
          .get(`/api/plants/${expectedId}`)
          .expect(200, expectedPlant);
      });
    });
    context('given malicious attack plant, sanitize and return', () => {
      const maliciousPlant = {
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        id: 1,
        content: 'Naughty naughty very naughty <script>alert("xss");</script>',
        img: 'Naughty naughty very naughty <script>alert("xss");</script>'
      };
      const expectedPlant = {
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        id: 1,
        content: 'Naughty naughty very naughty <script>alert("xss");</script>',
        img: 'Naughty naughty very naughty <script>alert("xss");</script>'
      };
      beforeEach('insert plants', () => {
        return db.into('plants')
          .insert(maliciousPlant);
      });
      it('malicious plant inserted, return sanitized plant', () => {
        return supertest(app)
          .get('/api/plants/1')
          .expect(200, expectedPlant);
      });

    });
  });
});