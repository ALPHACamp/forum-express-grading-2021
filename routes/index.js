const restController = require("../controllers/restControllers")
const adminController = require("../controllers/adminControllers")
const userController = require("../controllers/userController")

module.exports = (app, passport) => {
  app.get("/admin/restaurants", adminController.getRestaurants)
  app.get("/admin", (req, res) => {
    return res.render("admin/restaurants")
  })

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

  app.get("/restaurants", restController.getRestaurants)

  app.get("/", (req, res) => {
    res.render("restaurants")
  })
}
