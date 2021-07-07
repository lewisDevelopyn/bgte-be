const knex = require('../config/knex');

module.exports = () => {
    /**
     * Set up the tables
    **/
    require('../db_setup')(knex);
    return knex;
}