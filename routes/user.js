 const express = require("express");
 const router = express.Router();
 const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport")
const {savedRedirectUrl} = require("../middleware.js");
const userController = require("../controller/user.js");

//signUpForm,signup
 router.route("/signup")
.get( (userController.signUpForm))
.post( wrapAsync(userController.signup));

// loginForm, login

router.route("/sign")

.get( (userController.loginForm))
.post( savedRedirectUrl,
    passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash: true,
    }),userController.login);


router.get("/logout", userController.logout);

module.exports = router;