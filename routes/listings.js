const express = require('express')
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const {listingSchemaa , reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isloggedIn, isOwner} = require("../middleware.js");


const multer  = require('multer')
const {storage} = require("../Cloudconfig.js");
const upload = multer({storage})


const listingControls = require("../controllers/listings.js");



//INDEX ROUTE
router.get("/" , wrapAsync(listingControls.index)
)

//NEW ROUTE
router.get('/new', isloggedIn,listingControls.new)


//SHOW ROUTE
router.get("/:id" ,wrapAsync(listingControls.show)
)

//CREATE ROUTE  
router.post("/",isloggedIn,upload.single("listing[image]"), wrapAsync(listingControls.create)
)

// router.post("/",upload.single("listing[image]") ,  (req,res) => {
//     res.send(req.file);
// }
// )

// EDIT ROUTE
router.get("/:id/edit" ,isloggedIn ,isOwner,wrapAsync(listingControls.edit)
)

// UPDATE ROUTE
router.put("/:id" ,isloggedIn, isOwner, upload.single("listing[image]"), wrapAsync (listingControls.update)
)

//DELETE ROUTE
router.delete("/:id" ,isloggedIn, isOwner,wrapAsync (listingControls.delete)
)

module.exports = router;