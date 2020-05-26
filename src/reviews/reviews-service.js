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
      .then(rows => {
        return rows[0]
      })
  },
  deleteById(knex, id) {
    return knex('reviews')
      .where({ id })
      .delete()
  },
  updatReview(knex, id, newReviewFields) {
    return knex('reviews')
      .where({ id })
      .update(newReviewFields)
  }
}
//deleteReview(){}

module.exports = ReviewsService