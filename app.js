const express = require("express");
const exphbs = require("express-handlebars"); // 引入 handlebars
const app = express();
const port = 3000;
const db = require("./models"); // 引入資料庫
app.use(express.urlencoded({ extended: true }));
app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" })); // Handlebars 註冊樣板引擎
app.set("view engine", "hbs"); // 設定使用 Handlebars 做為樣板引擎

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});

require("./routes")(app);

module.exports = app;
