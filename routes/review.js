const express = require('express')
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const {listingSchemaa , reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isloggedIn, isReviewAuthor} = require("../middleware.js");

const reviewControls = require("../controllers/reviews.js");



  //VALIDATE SERVER SIDE REVIEW
  const validateReview = (req ,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error)
    {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressErrors(400,errMsg);
    } else{
        next();
    }
    }



// reviews post route

router.post("/" , isloggedIn,validateReview ,wrapAsync(reviewControls.postReview))


//Delete review route

router.delete("/:reviewId" , 
    isloggedIn,
    isReviewAuthor,
    wrapAsync(reviewControls.destroyReview)
);


module.exports = router;
