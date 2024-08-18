const User = require("../models/user.js");


module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
  }

module.exports.signup = async(req,res)=>{
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        req.login(registeredUser,(err) =>{
            if(err){
                return next(err);
            }
            req.flash("success" , "you are logged inn")
            res.redirect("/listings");
        })
    }
    catch(e){
    req.flash("error" , e.message);
    console.log(e)
       res.redirect("/signup");
    }
}

module.exports.renderLogin =  (req,res) =>{
        res.render("users/login");
    }

module.exports.login = async (req,res) =>{
    req.flash("success" , "you are logged inn")
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.renderLogout = (req,res,next) => {
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success" , "you are logged out")
        res.redirect("/listings");
    })}