const bcrypt = require('bcrypt');

module.exports = async knex => {
    // Access Templates
    let exists = await knex.schema.hasTable('users');

    console.log(`Checking if the table users exists in database ${process.env.DB_DATABASE}.`);

    if (!exists) {
        console.log(`Creating table users in database ${process.env.DB_DATABASE}.`);
        await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        await knex.schema.createTable('users', function (table) {
            table.uuid("id").unique().primary().defaultTo(knex.raw('uuid_generate_v4()'));          
            table.string('first_name', 255).notNullable();
            table.string('last_name', 255).notNullable();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.timestamps(true, true);
         })

        await knex('users').insert({
            email: 'admin@developyn.com',
            first_name: 'Lewis',
            last_name: 'Howl',
            password: await bcrypt.hash('password123', 10)
        });
    }
}