const restController = require("../controllers/restController");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const commentController = require("../controllers/commentController");
const passport = require("passport");
const helpers = require("../_helpers");

// multer setup
const multer = require("multer");
const categoryController = require("../controllers/categoryController");
const upload = multer({ dest: "temp/" });

module.exports = (app) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next();
    }
    res.redirect("/signin");
  };

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next();
      }
      return res.redirect("/");
    }
    res.redirect("/signin");
  };

  // 如果使用者訪問首頁，就導向 /restaurants 的頁面
  app.get("/", authenticated, (req, res) => {
    res.redirect("restaurants");
  });
  app.get("/restaurants", restController.getRestaurants);

  app.get("/admin", authenticatedAdmin, (req, res) => {
    res.redirect("/admin/restaurants");
  });
  app.get(
    "/admin/restaurants",
    authenticatedAdmin,
    adminController.getRestaurants
  );

  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);

  app.get("/signin", userController.signInPage);
  app.post(
    "/signin",
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true,
    }),
    userController.signIn
  );
  app.get("/logout", userController.logout);
  app.get(
    "/admin/restaurants/create",
    authenticatedAdmin,
    adminController.createRestaurants
  );
  app.post(
    "/admin/restaurants",
    authenticatedAdmin,
    upload.single("image"),
    adminController.postRestaurants
  );
  app.get(
    "/admin/restaurants/:id",
    authenticatedAdmin,
    adminController.getRestaurant
  );
  app.get(
    "/admin/restaurants/:id/edit",
    authenticatedAdmin,
    adminController.editRestaurant
  );
  app.put(
    "/admin/restaurants/:id",
    authenticatedAdmin,
    upload.single("image"),
    adminController.putRestaurant
  );
  app.delete(
    "/admin/restaurants/:id",
    authenticatedAdmin,
    adminController.deleteRestaurant
  );
  app.get("/admin/users", authenticatedAdmin, adminController.getUsers);
  app.put(
    "/admin/users/:id/toggleAdmin",
    authenticatedAdmin,
    adminController.toggleAdmin
  );
  app.get(
    "/admin/categories",
    authenticatedAdmin,
    categoryController.getCategories
  );
  app.post(
    "/admin/categories",
    authenticatedAdmin,
    categoryController.postCategory
  );
  app.get(
    "/admin/categories/:id",
    authenticatedAdmin,
    categoryController.getCategories
  );
  app.put(
    "/admin/categories/:id",
    authenticatedAdmin,
    categoryController.putCategory
  );
  app.delete(
    "/admin/categories/:id",
    authenticatedAdmin,
    categoryController.deletCategory
  );
  app.get("/restaurants/:id", restController.getRestaurant);
  app.post("/comments", authenticated, commentController.postComment);
  app.delete("/comments/:id", authenticated, commentController.deleteComment);
};
