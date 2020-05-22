const path = require('path');
const express = require('express');
const PlantsService = require('./plants-service');
const PlantsRouter = express.Router();
const jsonParser = express.json();
const xss = require('xss');

const serializePlant = plant => ({
  id: Number(xss(plant.id)),
  name: xss(plant.name),
  content: xss(plant.content),
  img: plant.img
});

PlantsRouter.route('/')
  .get( (req, res, next) => {
    const knexInstance = req.app.get('db');
    PlantsService.getAllPlants(knexInstance)
      .then(plants => {
        res.json(plants.map(serializePlant));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {name} = req.body;
    const newPlant = {name};
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

PlantsRouter.route('/:plantId')
  .all( (req, res, next) => {
    const knexInstance = req.app.get('db');
    const plantId = req.params.plantId;
    PlantsService.getById(knexInstance, plantId)
      .then(plant => {
        if(!plant){
          return res.status(404).json({
            error: {message: 'plant does not exist.'}
          });
        }
        res.plant = plant;
        next();
      })
      .catch(next);
  })
  .get( (req, res) => {
    res.json(serializePlant(res.plant));
  })
  .delete( (req, res, next) => {
    const knexInstance = req.app.get('db');
    const plantId = req.params.plantId;
    PlantsService.deleteById(knexInstance, plantId)
      .then( () => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, ( req, res, next ) => {
    const knexInstance = req.app.get('db');
    const {name} = req.body;
    const newPlantData = {name};
    const plantId = req.params.plantId;
    const numberOfValues = Object.values(newPlantData).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {message: 'Request body must contain name.'}
      });
    }
    newPlantData.name = name(xss);

    PlantsService.updateById(knexInstance, plantId, newPlantData)
      .then( () => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = PlantsRouter;