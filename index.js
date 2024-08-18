if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}




const express = require('express')
const app = express();
const mongoose = require('mongoose');
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErrors = require("./utils/ExpressErrors.js");
// const {listingSchemaa , reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo"); 
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/users.js");



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const dbUrl = process.env.atlas_Url;

main()
.then(() => {
    console.log("connection successful");
})
.catch((err) => console.log(err));

async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    await mongoose.connect(dbUrl);

}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.secret,
    },
    touchAfter: 24 * 3600,
})

store.on("error" , ()=>{
    console.log("error",err);
})

  const sessionOption = {
    store,
    secret: process.env.secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};


// app.get('/', function (req, res) {
//     res.send('root is working');
//   })


app.use(session(sessionOption));
app.use(flash());


// PASSPORT-BASIC MIDDLEWARES

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;


    next();

})

// app.get("/demouser" , async(req,res) => {
//     let fakeUser = new User ({
//         email:"student123@gmail.com",
//         username:"RahulBishtt",
//     })
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })


// using EXPRESS-Routes
app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/" , userRouter);



app.all("*" , (req,res,next) =>{
    next(new ExpressErrors(401,"page not found"));
})

//ERROR HANDLER for all

app.use((err,req,res,next)=>{
    let {statusCode=500 , message="something wrong"} = err;
    res.status(statusCode).render("./listings/error.ejs",{message});
    // res.status(statusCode).send(message);
})


app.listen(8080 , ()=>{
    console.log("app is listening on port 8080");
})