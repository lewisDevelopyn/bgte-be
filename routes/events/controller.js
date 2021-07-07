const ApiError = require("../../errors/ApiError");
const fs = require("fs");
const csv = require("csv-parser");
const knex = require("../../config/knex");

class EventsController {
  async getEvents(req, res, next) {
    try {
      let capitalized_search;
      if (req.query.search) {
        capitalized_search =
          req.query.search.charAt(0).toUpperCase() + req.query.search.slice(1);
      }
      if (
        req.query.filter &&
        req.query.filter !== "price_above_100" &&
        req.query.filter !== "price_below_100"
      ) {
        req.query.filter = null;
        next(Axios.badRequest("Invalid filter applied"));
        return;
      }
      let per_page = req.query.per_page || 10;
      let page = req.query.page || 1;
      let offset = (page - 1) * per_page;
      let events = [];
      if (!req.query.search && req.query.filter == "price_above_100") {
        events = await knex
          .where("name", "like", `%${req.query.search}%`)
          .orWhere("location", "like", `%${req.query.search}%`)
          .orWhere("name", "like", `%${capitalized_search}%`)
          .orWhere("location", "like", `%${capitalized_search}%`)
          .andWhere("price", "<", 100)
          .orderBy("start_date")
          .from("events")
          .offset(offset)
          .limit(per_page);
      }
      if (!req.query.search && req.query.filter == "price_below_100") {
        events = await knex
          .where("name", "like", `%${req.query.search}%`)
          .orWhere("location", "like", `%${req.query.search}%`)
          .orWhere("name", "like", `%${capitalized_search}%`)
          .orWhere("location", "like", `%${capitalized_search}%`)
          .andWhere("price", "<", 100)
          .orderBy("start_date")
          .from("events")
          .offset(offset)
          .limit(per_page);
      }
      if (req.query.search && req.query.filter == "price_below_100") {
        events = await knex
          .where("name", "like", `%${req.query.search}%`)
          .orWhere("location", "like", `%${req.query.search}%`)
          .orWhere("name", "like", `%${capitalized_search}%`)
          .orWhere("location", "like", `%${capitalized_search}%`)
          .andWhere("price", "<", 100)
          .orderBy("start_date")
          .from("events")
          .offset(offset)
          .limit(per_page);
      }
      if (req.query.search && req.query.filter == "price_above_100") {
        events = await knex
          .where("name", "like", `%${req.query.search}%`)
          .orWhere("location", "like", `%${req.query.search}%`)
          .orWhere("name", "like", `%${capitalized_search}%`)
          .orWhere("location", "like", `%${capitalized_search}%`)
          .andWhere("price", ">", 100)
          .orderBy("start_date")
          .from("events")
          .offset(offset)
          .limit(per_page);
      } else if (req.query.search && !req.query.filter) {
        events = await knex
          .where("name", "like", `%${req.query.search}%`)
          .orWhere("location", "like", `%${req.query.search}%`)
          .orWhere("name", "like", `%${capitalized_search}%`)
          .orWhere("location", "like", `%${capitalized_search}%`)
          .orderBy("start_date")
          .from("events")
          .offset(offset)
          .limit(per_page);
      } else
        events = await knex
          .select("*")
          .orderBy("start_date")
          .from("events")
          .offset(offset)
          .limit(per_page);
      res.status(200).send({
        per_page,
        events
      });
    } catch (error) {
      next(ApiError.badRequest(error));
    }
  }
  async getEvent(req, res, next) {
    const id = req.query.id;
    if (!id) {
      next(ApiError.missingField());
      return;
    }
    try {
      const event = await knex
        .where({ id })
        .from("events")
        .limit(1);
      res.status(200).send({ events: event[0] });
    } catch (error) {
      next(ApiError.badRequest(error));
      return;
    }
  }

  //I cannot get the row id's assigned to a variable to be able to return. If I could, I could tell the user which specific rows have been errored. 
 //At the moment, all I can do is tell them that malformed data will have been rejected. They can fix specific rows and reupload the same file, as it will reject duplicates based on uuid constraints.
  async uploadEvent(req, res, next) {
    try {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", row => {
          const insert = insert_row(row, next);
          if(insert !== 'success') {
              console.error(row.id);
          }
        })
        .on("error", () => {
            next(Api.badRequest('bad data'));
        })
        res.status(200).send({message: 
            'Data has been transferred. Any malformed data will have been rejected. If you are missing data, see what is malformed in the specific row, and reupload the file, as duplicates will be rejected.'
        })
    } catch (error) {
        console.error(error);
    }
  }
}

const insert_row = async function(row, next) {
  try {
    await knex("events").insert(row);
    return "success";   
  } catch (error) {
    return [error.file, error.constraint];
  }
};

module.exports = new EventsController();
