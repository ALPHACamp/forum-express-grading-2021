const express = require("express");
const exphbs = require("express-handlebars"); // 引入 handlebars
const app = express();
const port = 3000;
const db = require("./models"); // 引入資料庫
const passport = require("./config/passport");

//
const flash = require("connect-flash");
const session = require("express-session");
app.use(flash());
app.use(
	session({
		secret: "123",
		resave: false,
		saveUninitialized: false,
	})
);
app.use((req, res, next) => {
	res.locals.success_messages = req.flash("success_messages");
	res.locals.error_messages = req.flash("error_messages");
	next();
});
app.use(express.urlencoded({ extended: true }));
app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" })); // Handlebars 註冊樣板引擎
app.set("view engine", "hbs"); // 設定使用 Handlebars 做為樣板引擎
app.use(passport.initialize());
app.use(passport.session());
app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});

require("./routes")(app, passport);

module.exports = app;
