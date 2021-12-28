const restController = require("../controllers/restControllers")
const adminController = require("../controllers/adminControllers")
const userController = require("../controllers/userController")

module.exports = (app, passport) => {
  // Authorization Authentication Middleware
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    return res.redirect("/signin")
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next()
      }
      return res.redirect("/")
    }
    return res.redirect("/signin")
  }

  // Admin path
  app.get(
    "/admin/restaurants/create",
    authenticatedAdmin,
    adminController.createRestaurant
  )
  app.post(
    "/admin/restaurants",
    authenticatedAdmin,
    adminController.postRestaurant
  )
  app.get(
    "/admin/restaurants",
    authenticatedAdmin,
    adminController.getRestaurants
  )
  app.get("/admin", authenticatedAdmin, (req, res) => {
    return res.render("admin/restaurants")
  })

  // User sign in & up & User logout
  app.get("/signin", userController.signInPage)
  app.post(
    "/signin",
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true
    }),
    userController.signIn
  )
  app.get("/logout", userController.logout)
  app.get("/signup", userController.signUpPage)
  app.post("/signup", userController.signUp)

  // Restaurants path
  app.get("/restaurants", authenticated, restController.getRestaurants)

  // Home page
  app.get("/", authenticated, (req, res) => {
    res.render("restaurants")
  })
}
