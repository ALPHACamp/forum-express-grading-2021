const db = require("../models")
const Restaurant = db.Restaurant

const adminController = {
  // View all restaurants
  getRestaurants: (req, res) => {
    Restaurant.findAll({ raw: true, nest: true }).then((restaurants) => {
      return res.render("admin/restaurants", { restaurants })
    })
  },

  // View one restaurant detail
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(
      (restaurant) => {
        return res.render("admin/restaurant", { restaurant })
      }
    )
  },

  // Create page
  createRestaurant: (req, res) => {
    return res.render("admin/create")
  },

  // Create restaurant
  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body

    if (!name) {
      req.flash("error_messages", "Missing restaurant's name!")
      return res.redirect("back")
    }
    return Restaurant.create({
      name,
      tel,
      address,
      opening_hours,
      description
    }).then((restaurant) => {
      restaurant = restaurant.toJSON()
      req.flash(
        "success_messages",
        `${restaurant.name} was successfully created!`
      )
      return res.redirect("/admin/restaurants")
    })
  }
}

module.exports = adminController
