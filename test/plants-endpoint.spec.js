  
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const fixtures = require('./plants.fixtures');
const { makePlantsArray, makeMaliciousPlant } = require('./plants.fixtures');

describe('plants endpoint', function() {
  let db

  before('make new knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from database', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE  plants, reviews RESTART IDENTITY CASCADE'));

  afterEach('cleanup after each test', () => db.raw('TRUNCATE plants, reviews RESTART IDENTITY CASCADE'));

  describe('GET /plants', () => {
    context('given no plants', () => {
      it('responds 200 and an empty array', () => {
        return supertest(app)
          .get('/plants')
          .expect(200, [])
      })
    })
    context('given plants exist', () => {
      const testPlants = makePlantsArray();
      beforeEach('insert plants', () => {
        return db.into('plants')
          .insert(testPlants);
      });
      it('responds 200 and returns array of plants', () => {
        return supertest(app)
          .get('/plants')
          .expect(200, testPlants);
      });
    });
    context('given an XSS attack plant', () => {
      const {maliciousPlant, expectedPlant } = fixtures.makeMaliciousPlant()
       
      beforeEach('insert malicious plants', () => {
        return db
        .into('plants')
          .insert([maliciousPlant]);
      });
      it('malicious plant inserted, return sanitized plant', () => {
        return supertest(app)
          .get('/plants')
          .expect(200)
          .expect(res =>{
        expect(res.body[0].name).to.eql(expectedPlant.name)
        expect(res.body[0].content).to.eql(expectedPlant.content)
          })
      });
    });
  });
 
});