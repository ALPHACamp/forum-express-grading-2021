const express = require("express")
const app = express()
const port = 3000
const exphbs = require("express-handlebars")

// Set view engine to handlebars
app.engine("hbs", exphbs.engine({ extname: ".hbs" }))
app.set("view engine", "hbs")

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require("./routes")(app)

module.exports = app
