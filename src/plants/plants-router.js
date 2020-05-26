const path = require('path');
const express = require('express')
const PlantsService = require('./plants-service');
const PlantsRouter = express.Router()
const jsonParser = express.json()
const xss = require('xss')

const serializePlant = plant => ({
  name: xss(plant.name),
  type: plant.type,
  content: xss(plant.content),
  id: plant.id,
  img: plant.img
});

PlantsRouter.route('/')
  .get( (req, res, next) => {
    console.log('working')
    const knexInstance = req.app.get('db');
    PlantsService.getAllPlants(knexInstance)
      .then(plants => {
        res.json(plants.map(serializePlant));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {name, type, content} = req.body;
    const newPlant = {name, type, content};
    for (const [key, value] of Object.entries(newPlant)) {
      if (value === null) {
        return res.status(400).json({
          error: {message: `Missing ${key} in request body.`}
        });
      }
    }
    PlantsService.insertPlant(knexInstance, newPlant)
      .then(plant => {
        res.status(201)
          .location(path.posix.join(req.originalUrl, `/${plant.id}`))
          .json(serializePlant(plant));
      })
      .catch(next);
  });

PlantsRouter.route('/:plantid')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db');
    const plantid = req.params.plantid;
    PlantsService.getById(knexInstance, plantid)
      .then(plant => {
        if(!plant){
          return res.status(404).json({
            error: {message: 'plant does not exist.'}
          });
        }
        res.plant = plant
        next()
      })
      .catch(next)
  })
  .get( (req, res, next) => {
    res.json(serializePlant(res.plant));
  })
  .delete( (req, res, next) => {
    const knexInstance = req.app.get('db');
    const plantid = req.params.plantid;

    PlantsService.deleteById(knexInstance, plantid)
      .then( () => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, ( req, res, next ) => {
    const knexInstance = req.app.get('db');
    const {name, type, content} = req.body;
    const newPlantData = {name,type, content}
    const plantid = req.params.plantid;
    const numberOfValues = Object.values(newPlantData).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {message: 'Request body must contain name.'}
      });
    }
   // newPlantData.name = name(xss);

    PlantsService.updateById(knexInstance, plantid, newPlantData)
      .then( () => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = PlantsRouter;