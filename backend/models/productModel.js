import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // * this is custom id for admin purpose
    id: {
      type:String,
      unique:true
    },

    name: {
      type: String,
      required: true,
    },

    // * for SEO friendly.
    slug: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // * this array is used for additional info like if they have to store the structured description
    additionalDiscription:{
      type:[Object],
      default:[]
  },

    // * Original price
    originalPrice: {
      type: Number,
    },

    // * discounted price
    price: {
      type: Number,
      required: true,
    },

    // * we are adding the product into the category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    imgLink: {
      type: [String], // Array of strings
      default: [],
    },

    variety: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],

    // * this is for user purpose
    qty: {
      type: Number,
      default: 1,
    },

    photo: {
      data: Buffer,
      contentType: String,
    },

    // This is for admin purpose
    stock: {
      type: Number,
      required: true,
    },

    // * For storing image data

    shipping: {
      type: Number,
      default:4,
    },

    // * This is for handling the delivery charges.

    deliveryCharge: {
      type: Number,
      default: 70,
    },

    // * This attribute is used to store the service center details of the product
    serviceDays:{
      type: Number,
    },

    returnDays: {
      type: Number,
      default: 0,
    },
    vendername:{
      type: String,
     },
     venderAddress:{
      type: String,
     },
    replacementDays: {
      type: Number, 
      default: 0,
    },
    status:{
      type:Number,
      default:0
    },

    // * This is for storing the user ratings abour admin products.

    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 1, max: 5 },
      },
    ],

    
  },
  { timestamps: true }

);


// * create text index for the name and the description fields.
productSchema.index({name:'text', description:'text'});


export default mongoose.model("Products", productSchema);
