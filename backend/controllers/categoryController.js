import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

// * this controller is used to create category
export const createCategory = async (req, res) => {
  try {
    const { name , image } = req.body;


    // * check for existing category
    const existingCate = await categoryModel.findOne({ name });
    if (existingCate) {
      return res.status(400).send({ message: "Category already exists" });
    }

    const newCategory = new categoryModel({
      name,
      image,
      slug: slugify(name),
    });

    await newCategory.save();
    res.status(200).send({ message: "Category created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error while creating category" });
  }
};

// * this controller is used to get all categories
export const getCategories = async (req, res) => {
  try {
    const allcategories = await categoryModel.find({}).lean();

    res.status(200).send({ message: "All categories", data: allcategories });
  } catch (error) {
    res.status(500).send({ message: "Error while getting categories" });
  }
};



// * this controller is used to get single category
export const getSingleCategory = async (req,res) =>{
    try {
        const {slug} = req.params;

        const category = await categoryModel.findOne({slug: req.params.slug}).lean();

        res.status(200).send({
            success:true,
            message:"Category fetched successfully",
            category
        })
        
    } catch (error) {
        res.status(500).send({ message: "Error while getting category" });
    }
}

// * this controller is used to update category
export const updateCategory = async (req,res) =>{
    try {
        const {name,image} = req.body;
        const {id} = req.params;

        const category  = await categoryModel.findByIdAndUpdate(id,{name,image,slug:slugify(name)});

        res.status(200).send({
            success:true,
            message:"Category updated successfully",
            category,
        })
        
    } catch (error) {
        res.status(500).send({
            message:"something went wrong while updating category"
        })
    }
}


// * this controller is used to delete category
export const deleteCategory = async (req,res) =>{
    try {
        const {id} = req.params;
        const category = await categoryModel.findByIdAndDelete(id);

        res.status(200).send({
            success:true,
            message:"Category deleted successfully",
        })
    } catch (error) {
        res.status(500).send({
            message:"something went wrong while deleting category"
        })
    }
}