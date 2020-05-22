
const PlantsService = {
    getAllPlants(knex) {
        return knex
          .select('*')
          .from('plants');
      },
      insertPlant(knex, newPlant) {
        return knex
          .insert(newPlant)
          .into('plants')
          .returning('*')
          .then( rows => {
            return rows[0];
          });
      },

  getById(knex, id) {
    return knex.from('plants').select('*').where('id', id).first()
  },

  getReviewsForPlants(knex, id) {
    return knex
      .from('reviews')
      .select(
        'reviews.id',
        'reviews.rating',
        'reviews.content',
      )
      .where('plants.id', id)
      .innerJoin('plants', 'reviews.plantId', 'plants.id')
      .groupBy('reviews.id' )
  },

  
}


module.exports = PlantsService