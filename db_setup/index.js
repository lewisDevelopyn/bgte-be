const fs = require('fs');
const tables = `${__dirname}/tables`;
const directories = fs.readdirSync(tables);

module.exports = async knex => {
    for (const dir of directories) {
        await require(`${tables}/${dir}`)(knex);
    }
}