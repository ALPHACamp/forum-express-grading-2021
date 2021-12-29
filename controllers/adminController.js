const imgur = require("imgur-node-api")
const fs = require("fs")
const db = require("../models")
const User = db.User
const Restaurant = db.Restaurant

const adminController = {
  // Show all users
  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then((users) => {
      return res.render("admin/users", { users })
    })
  },

  // Toggle user
  toggleAdmin: (req, res) => {
    User.findByPk(req.params.id).then((user) => {
      const { isAdmin, email } = user.toJSON()
      // Forbid alter superuser
      if (email === "root@example.com") {
        req.flash("error_messages", "禁止變更管理者權限")
        return res.redirect("back")
      }

      // Toggle user authorization
      user
        .update({
          isAdmin: !isAdmin
        })
        .then(() => {
          req.flash("success_messages", "使用者權限變更成功")
          return res.redirect("/admin/users")
        })
    })
  },

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
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: file ? img.data.link : null
        }).then((restaurant) => {
          restaurant = restaurant.toJSON()
          req.flash(
            "success_messages",
            `${restaurant.name} was successfully created!`
          )
          return res.redirect("/admin/restaurants")
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
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then((restaurant) => {
          restaurant
            .update({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: file ? img.data.link : restaurant.image
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
