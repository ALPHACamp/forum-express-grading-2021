const fs = require("fs")
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
    const { file } = req // equal to const file = req.file

    if (!name) {
      req.flash("error_messages", "Missing restaurant's name!")
      return res.redirect("back")
    }

    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log("Error: ", err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.create({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: file ? `/upload/${file.originalname}` : null
          }).then((restaurant) => {
            restaurant = restaurant.toJSON()
            req.flash(
              "success_messages",
              `${restaurant.name} was successfully created!`
            )
            return res.redirect("/admin/restaurants")
          })
        })
      })
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null
      }).then((restaurant) => {
        restaurant = restaurant.toJSON()
        req.flash(
          "success_messages",
          `${restaurant.name} was successfully created!`
        )
        return res.redirect("/admin/restaurants")
      })
    }
  },

  // Edit restaurant
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(
      (restaurant) => {
        return res.render("admin/create", { restaurant })
      }
    )
  },

  // Put restaurant
  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    const { file } = req

    if (!name) {
      req.flash("error_messages", "Missing restaurant's name!")
      return res.redirect("back")
    }

    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log("Error: ", err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.findByPk(req.params.id).then((restaurant) => {
            restaurant
              .update({
                name,
                tel,
                address,
                opening_hours,
                description,
                image: file ? `/upload/${file.originalname}` : restaurant.image
              })
              .then((restaurant) => {
                req.flash(
                  "success_messages",
                  `${restaurant.name} was update successfully.`
                )
                return res.redirect("/admin/restaurants")
              })
          })
        })
      })
    } else {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        restaurant
          .update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: restaurant.image
          })
          .then((restaurant) => {
            req.flash(
              "success_messages",
              `${restaurant.name} was update successfully.`
            )
            return res.redirect("/admin/restaurants")
          })
      })
    }
  },

  // Delete restaurant
  deleteRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant.destroy().then((restaurant) => {
        req.flash("success_messages", `${restaurant.name} has been deleted.`)
        return res.redirect("/admin/restaurants")
      })
    })
  }
}

module.exports = adminController
