const Listing = require("../models/listing.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const {listingSchemaa , reviewSchema} = require("../schema.js");



module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    // console.log(allListings)
    res.render("./listings/index.ejs" , {allListings});
}


module.exports.new = (req, res)=> {
    res.render("./listings/new.ejs");
  }


module.exports.show = async (req,res)=>{
    let {id} = req.params;
    const listings = await Listing.findById(id)
    .populate({path:"reviews",
    populate:{path:"author",
    },
}).populate("owner");
    // console.log(allListings)
    if(!listings){
        req.flash("error" , "listing you serached for not exist");
        res.redirect("/listings");
     
         }
    res.render("./listings/show.ejs" , {listings});
}


module.exports.create = async (req, res ,next) => {
    let url = req.file.path;
    let filename =  req.file.filename;
    let result= listingSchemaa.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressErrors(400,result.error);
    }
   const newListings = new Listing(req.body.listing);
   newListings.owner = req.user._id;
   newListings.image = {url , filename};
   await newListings.save();
   req.flash("success" , "new listing created");
   res.redirect("/listings");

}

module.exports.edit = async (req,res)=>{
    let {id} = req.params;
    const listings = await Listing.findById(id);
    if(!listings){
        req.flash("error" , "listing you serached for not exist");
        res.redirect("/listings");
      }

        let orignalImageUrl = listings.image.url;
        orignalImageUrl = orignalImageUrl.replace("/upload" , "/upload/h_250/w_250");
        res.render("./listings/edit.ejs" , {listings , orignalImageUrl});
}

module.exports.update = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename =  req.file.filename;
    listing.image = {url , filename};
    await listing.save();
}



   req.flash("success" , "listing updated");

    res.redirect(`/listings/${id}`); 
}

module.exports.delete = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
   req.flash("success" , "listing deleted");

    res.redirect("/listings");
}