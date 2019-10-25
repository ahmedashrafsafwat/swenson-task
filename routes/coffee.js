const routes = require("express").Router();
const Coffee = require("../models/Coffee");
var ObjectId = require("mongoose").Types.ObjectId;

/**
 *  Get all coffees
 */
routes.get("/all", (req, res) => {
  Coffee.find({ isPublished: true })
    .lean()
    .exec((err, coffees) => {
      if (err) {
        res.status(404).json({ message: "Error getting coffees" });
      } else {
        // Note: returned coffees will be in form of array
        if (coffees && coffees.length > 0) {
          res.contentType("json");
          res.status(200).json({
            message: "Successfully retrieved all the coffees",
            data: coffees
          });
        } else {
          res.status(200).json({
            message: "No coffees found",
            data: []
          });
        }
      }
    });
});

/**
 *  Add a new coffee
 */
routes.post("/add", (req, res) => {
  // check for errors
  req.assert("sku_code", "SKU must be not empty").notEmpty();
  req.assert("product_type", "product_type must be not empty").notEmpty();
  req.assert("water_line_compatible", "must be boolean").isBoolean();
  req.assert("pack_size", "must be number").isNumeric();

  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return res.status(401).json({ message: errors });
  }

  let coffeeReq = req.body;
  console.log(coffeeReq);
  const coffee = new Coffee(coffeeReq);

  // save image uri if sent

  coffee.save(err => {
    if (err) {
      console.log(err);
      if (err.code == "11000") {
        res.status(422).json({ message: "Coffee id already exists!! " });
      } else {
        res.status(404).json({ message: "Error saving coffee" });
      }
    } else {
      res.status(200).json({
        message: "Coffee Saved Successfully",
        data: { id: coffee._id.toString() }
      });
    }
  });
});

/**
 * Get a specific product(s) and return it's SKU code
 */
routes.get("/get/", (req, res) => {
  // get the filters from url query
  var filterObject = {};
  if (req.query.product_type)
    filterObject.product_type = {
      $regex: req.query.product_type.toUpperCase()
    };

  if (req.query.water_line_compatible)
    filterObject.water_line_compatible =
      req.query.water_line_compatible == "true";

  if (req.query.coffee_flavor)
    filterObject.coffee_flavor = {
      $regex: req.query.coffee_flavor.toUpperCase()
    };

  if (req.query.pack_size && req.query.pack_size > 0)
    filterObject.pack_size = Number(req.query.pack_size);

  if (req.query.model) filterObject.model = req.query.model;

  // Search for the targeted products
  Coffee.find(filterObject, (err, result) => {
    if (err) {
      res.status(404).send({
        message: "An error occured get the products"
      });
    } else {
      // return the SKU code only
      var data = result.map(x => x.sku_code);

      // return the results
      res.status(200).send({ data });
    }
  });
});

module.exports = routes;
