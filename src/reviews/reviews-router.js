const path = require('path');
const express = require('express');
const ReviewsService = require('./reviews-service.js');

const ReviewsRouter = express.Router();
const jsonParser = express.json();

const xss = require('xss');

const serializeReview = review => ({
    id: Number(xss(review.id)),
    content: xss(review.content),
    rating: review.rating,
    plantId: review.plantId
  });
ReviewsRouter.route('/')
  .get( (req, res) => {
    const knexInstance = req.app.get('db');
    ReviewsService.getAllReviews(knexInstance)
      .then(reviews => {
        res.json(reviews.map(serializeReview));
      });
  })
  
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {rating, content, plantId} = req.body;
    const newReview = {rating, content, plantId};
    for (const [key, value] of Object.entries(newReview)) {
      if (value === null) {
        return res.status(400).json({
          error: {message: `Missing ${key} in request body.`}
        });
      }
    }
    ReviewsService.insertReviews(knexInstance, newReview)
      .then(review => {
        console.log("created review:", review);
        res.status(201)
          .location(path.posix.join(req.originalUrl, `/${review.id}`))
          .json(serializeReview);
      })
      .catch(next);
  });

ReviewsRouter.route('/:reviewId')
  .all( (req, res, next) => {
    const knexInstance = req.app.get('db');
    const reviewId = req.params.reviewId;
    ReviewsService.getById(knexInstance, reviewId)
      .then(review => {
        if(!review) {
          return res.status(404).json({
            error: {message: 'Review does not exist.'}
          });
        }
        res.review = review;
        next();
      })
      .catch(next);
  })
  .get( (req, res ) => {
    res.json(serializeReview(res.review));
  })
  .delete( (req, res, next) => {
    const knexInstance = req.app.get('db');
    const reviewId = req.params.reviewId;
    ReviewsService.deleteById(knexInstance, reviewId)
      .then( () => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, ( req, res, next ) => {
    const knexInstance = req.app.get('db');
    const {rating, content, plantId } = req.body;
    const newReviewData = {rating, content, plantId};
    const reviewId = req.params.reviewId;
    const numberOfValues = Object.values(newReviewData).filter(Boolean).length;
    if (numberOfValues === 0) {
      res.status(400).json({
        error: {message: 'Request body must contain rating, content, or plantID.'}
      });
    }
    if (content) {
      newReviewData.content = xss(content);
    }

    ReviewsService.updateById(knexInstance, reviewId, newReviewData)
      .then( () => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = ReviewsRouter;