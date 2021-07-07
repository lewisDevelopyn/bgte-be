module.exports = async knex => {
    // Access Templates
    let exists = await knex.schema.hasTable('events');

    console.log(`Checking if the table events exists in database ${process.env.DB_DATABASE}.`);

    if (!exists) {
        console.log(`Creating table events in database ${process.env.DB_DATABASE}.`);
        await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        await knex.schema.createTable('events', function (table) {
            table.uuid("id").unique().primary().defaultTo(knex.raw('uuid_generate_v4()'));          
            table.string('name', 255).notNullable();
            table.datetime('start_date').notNullable();
            table.datetime('end_date').notNullable();
            table.string('description').notNullable();
            table.string('image');
            table.string('location').notNullable();
            table.float('price').notNullable();
            table.string('currency', 3).notNullable();
            table.string('currency_symbol').notNullable();
            table.timestamps(true, true);
         });
    }
}