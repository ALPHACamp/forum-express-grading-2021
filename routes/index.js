const restController = require("../controllers/restControllers")

module.exports = (app) => {
  app.get("/restaurants", restController.getRestaurants)

  app.get("/", (req, res) => {
    const msg = "/////"
    res.render("restaurants", { msg })
  })
}
