const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        url:String,
        filename:String
        // type:String,
        // default:"https://unsplash.com/photos/grayscale-photography-of-cityscape-XmT-nd4RFjY",
        // set:
        // (v) => v === ""?"https://unsplash.com/photos/grayscale-photography-of-cityscape-XmT-nd4RFjY" : v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"

    },

});
    listingSchema.post("findOneAndDelete", async (listing)=>{
        if(listing){
            await Review.deleteMany({_id: {$in:listing.review}})
        }


    });


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;