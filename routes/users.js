const express = require('express')
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userControls = require("../controllers/users.js");



// app.use(express.urlencoded({extended:true}));


//ROUTER ROUTES CONCEPTS
router.route("/signup")
.get(userControls.renderSignup)
.post( wrapAsync (userControls.signup));


// router.get('/signup' , userControls.renderSignup)
// router.post("/signup" , wrapAsync (userControls.signup));

router.get("/login", userControls.renderLogin);


router.post("/login"
    ,saveRedirectUrl    
    ,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}), userControls.login);


router.get("/logout", userControls.renderLogout)

module.exports = router;