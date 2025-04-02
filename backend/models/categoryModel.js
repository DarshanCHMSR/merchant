import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image:{
        type:String,
        default:""
    },
    slug:{
        type: String,
        lowercase:true,
    }
})


export default mongoose.model('Category', categorySchema);