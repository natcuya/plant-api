const path = require('path');
const express = require('express');
const ReviewsService = require('./reviews-service.js');

const ReviewsRouter = express.Router();
const jsonParser = express.json();

const xss = require('xss');

const serializeReview = review => ({
    id: review.id,
    content: xss(review.content),
    rating: review.rating,
    plantid: review.plantid
  });
ReviewsRouter.route('/')
  .get( (req, res,next) => {
    const knexInstance = req.app.get('db');
    ReviewsService.getAllReviews(knexInstance)
      .then(reviews => {
        res.json(reviews.map(serializeReview));
      })
      .catch(next)
  })
  
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db')
    const {rating, content, plantid} = req.body;
    const newReview = {rating, content, plantid};
    for (const [key, value] of Object.entries(newReview))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    ReviewsService.insertReviews(knexInstance, newReview)
      .then(review => {
        console.log("created review:", review);
        res.status(201)
          .location(path.posix.join(req.originalUrl, `/${review.id}`))
          .json(serializeReview(review));
      })
      .catch(next)
  });

ReviewsRouter.route('/:reviewid')
  .all( (req, res, next) => {
    const knexInstance = req.app.get('db');
    const reviewid = req.params.reviewid;
    ReviewsService.getById(knexInstance, reviewid)
      .then(review => {
        if(!review) {
          return res.status(404).json({
            error: {message: `Review doesn't exist`}
          });
        }
        res.review = review
        next()
      })
      .catch(next)
  })
  .get((req, res, next ) => {
    res.json(serializeReview(res.review));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db');
    const reviewid = req.params.reviewid;
    ReviewsService.deleteById(knexInstance, reviewid)
      .then(() => {
        res.status(204).end();
      })
      .catch(next)
  })
  .patch(jsonParser, ( req, res, next ) => {
    const knexInstance = req.app.get('db');
    const {rating, content} = req.body;
    const newReviewData = {rating, content};
    const reviewid = req.params.reviewid;
    const numberOfValues = Object.values(newReviewData).filter(Boolean).length;
    if (numberOfValues === 0) {
      res.status(400).json({
        error: {message: 'Request body must contain rating, content, or plantid.'}
      });
    }
    if (content) {
      newReviewData.content = xss(content);
    }

    ReviewsService.updateById(knexInstance, reviewid, newReviewData)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next)
  });

module.exports = ReviewsRouter;