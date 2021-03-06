require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const app = express();
const PlantsRouter = require('./plants/plants-router');
const ReviewsRouter = require('./reviews/reviews-router');

const morganOption = process.env.NODE_ENV === 'production'
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(PlantsRouter);
app.use(ReviewsRouter);
app.get('/', (req, res) => {
    res.send('Hello, world!')
    })

app.use(function errorHandler(error, req, res, next) {
           let response
           if (process.env.NODE_ENV=== 'production') {
             response = { error: { message: 'server error' } }
             console.error(error)
           } else {
            console.error(error)
             response = { message: error.message, error }
           }
           res.status(500).json(response)
         })
module.exports = app