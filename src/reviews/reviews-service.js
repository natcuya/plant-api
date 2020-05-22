const xss = require('xss')

const ReviewsService = {
    getAllReviews(knex) {
        return knex
          .select('*')
          .from('reviews');
      },
      getById(knex, id) {
        return knex
          .select('*')
          .from('reviews')
          .where('id', id)
          .first();
      },

  insertReview(knex, newReview) {
    return knex
      .insert(newReview)
      .into('reviews')
      .returning('*')
      .then(([review]) => review)
      .then(review =>
        ReviewsService.getById(knex, review.id)
      )
  },
}

module.exports = ReviewsService