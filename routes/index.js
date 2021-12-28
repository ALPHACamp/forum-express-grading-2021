const restController = require("../controllers/restControllers")
const adminController = require("../controllers/adminControllers")
const userController = require("../controllers/userController")

module.exports = (app) => {
  app.get("/admin/restaurants", adminController.getRestaurants)
  app.get("/admin", (req, res) => {
    return res.render("admin/restaurants")
  })

  app.get("/signup", userController.signUpPage)
  app.post("/signup", userController.signUp)

  app.get("/restaurants", restController.getRestaurants)

  app.get("/", (req, res) => {
    res.render("restaurants")
  })
}
