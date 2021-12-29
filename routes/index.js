const restController = require("../controllers/restControllers")
const adminController = require("../controllers/adminControllers")
const userController = require("../controllers/userController")
const helpers = require("../_helpers")
const multer = require("multer")
const upload = multer({ dest: "temp/" })

module.exports = (app, passport) => {
  // Authorization Authentication Middleware
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    return res.redirect("/signin")
  }

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next()
      }
      return res.redirect("/")
    }
    return res.redirect("/signin")
  }

  // Admin path
  app.get(
    "/admin/restaurants/:id/edit",
    authenticatedAdmin,
    adminController.editRestaurant
  )

  app.put(
    "/admin/restaurants/:id",
    authenticatedAdmin,
    upload.single("image"),
    adminController.putRestaurant
  )

  app.delete(
    "/admin/restaurants/:id",
    authenticatedAdmin,
    adminController.deleteRestaurant
  )

  app.get(
    "/admin/restaurants/create",
    authenticatedAdmin,
    adminController.createRestaurant
  )
  app.post(
    "/admin/restaurants",
    authenticatedAdmin,
    upload.single("image"),
    adminController.postRestaurant
  )
  app.get(
    "/admin/restaurants/:id",
    authenticatedAdmin,
    adminController.getRestaurant
  )
  app.get(
    "/admin/restaurants",
    authenticatedAdmin,
    adminController.getRestaurants
  )
  app.get("/admin", authenticatedAdmin, adminController.getRestaurants)

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
