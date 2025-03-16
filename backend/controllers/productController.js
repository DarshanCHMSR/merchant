import slugify from "slugify";
import Product from "../models/productModel.js";
import { validationResult,body } from "express-validator";
import { Parser } from "json2csv";


export const createProduct= async (req, res) => {
      try {
        const {
          id,
          name,
          description,
          price,
          category,
          stock,
          shipping,
          imgLink,
          variety,
          originalPrice,
          deliveryCharge,
          returnDays,
          replacementDays,
          serviceDays,
          additionalDiscription,
          status,
          vendername
        } = req.body;
        if (!name || !description || !price || !category || !stock || !shipping) {
          return res.status(401).send({
            error: "All required fields must be filled",
          });
        }
        // if there are error returns bad requests and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        //we are getting title, description, tag, and user id
        const product = new Product({
          id,
          name,
          slug: slugify(name),
          description,
          price,
          category,
          stock,
          shipping,
          originalPrice,
          deliveryCharge,
          returnDays,
          replacementDays,
          serviceDays,
          user: req.user._id,
          status,
          vendername,        
        });
    //      if (photo) {
    //   if (photo.size > 4000000) {
    //     return res.status(401).send({
    //       message: "Photo should be less than 4MB",
    //     });
    //   }
    //   product.photo.data = fs.readFileSync(photo.path);
    //   product.photo.contentType = photo.type;
    // }

        if (variety) {
          try {
            let parsedVariety;
        
            if (typeof variety === "string") {
              parsedVariety = JSON.parse(variety); // Parse if it's a string
            } else if (Array.isArray(variety)) {
              parsedVariety = variety; // Already an array, use it as is
            } else {
              throw new Error("Invalid format for variety");
            }
        
            product.variety = parsedVariety;
          } catch (error) {
            return res.status(400).send({ message: "Invalid variety format" });
          }
        }
        
        if (additionalDiscription) {
          try {
            let parsedAdditionalDiscription;
            
            if (typeof additionalDiscription === "string") {
              parsedAdditionalDiscription = JSON.parse(additionalDiscription);
            } else if (Array.isArray(additionalDiscription)) {
              parsedAdditionalDiscription = additionalDiscription;
            } else {
              throw new Error("Invalid format for additionalDiscription");
            }
        
            product.additionalDiscription = parsedAdditionalDiscription;
          } catch (err) {
            console.error("Invalid JSON format in additionalDiscription:", err);
            return res.status(400).send({ error: "Invalid JSON format in additionalDiscription" });
          }
        }
        if (imgLink) {
          try {
            let parsedLinks;
        
            if (typeof imgLink === "string") {
              parsedLinks = JSON.parse(imgLink); // Parse if it's a string
            } else if (Array.isArray(imgLink)) {
              parsedLinks = imgLink; // Already an array, use it as is
            } else {
              throw new Error("Invalid format for imgLink");
            }
        
            product.imgLink = parsedLinks;
          } catch (error) {
            return res.status(400).send({ message: "Invalid imgLink format" });
          }
        }
        
        
        //finally saving the things of user entered
        const savedNote = await product.save();
        res.json(savedNote);
      } catch (error) {
        res.status(500).send("Internal server error");
        
      }
    }
  export const getProductsByDate = async (req, res) => {
    try {
      let { startDate, endDate } = req.query;
  
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start and End date required" });
      }
  
      // Convert string to Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      // Check if the date conversion was successful
      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ message: "Invalid Date format" });
      }
  
      // Fetch products within the date range
      const products = await Product.find({
        createdAt: { $gte: start, $lte: end }
      }).sort({ createdAt: -1 });
      if (!products || products.length === 0) {
        return res.status(404).json({ message: "No products found to export." });
      }
  
      // Extract only required fields
      const fields = products.map((product) => ({
         id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        shipping: product.shipping,
        imgLink: product.imgLink,
        variety: product.variety,
        originalPrice: product.originalPrice,
        deliveryCharge: product.deliveryCharge,
        returnDays: product.returnDays,
        replacementDays: product.replacementDays,
        serviceDays: product.serviceDays,
        additionalDiscription: product.additionalDiscription,
        status:product.status,
        
      }));
  
      // Define CSV column headers
      const fieldNames = ["id", "name", "description", "price", "category", "stock", "shipping", "imgLink", "variety", "originalPrice", "deliveryCharge", "returnDays", "replacementDays", "serviceDays", "additionalDiscription","status"];
        
      // Create a new json2csv parser instance
      const json2csvParser = new Parser({ fields: fieldNames });
      const csv = json2csvParser.parse(fields); // Convert JSON to CSV format
  
      // Set headers for CSV file download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=products.csv");
      
      // Send CSV file as response
      res.status(200).end(csv);
  
     
  
      // res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
    
    export const exportUser = async (req, res) => {
      try {
        // Fetch all products with populated user details
        const products = await Product.find({}).populate("user");
    
        if (!products || products.length === 0) {
          return res.status(404).json({ message: "No products found to export." });
        }
    
        // Extract only required fields
        const fields = products.map((product) => ({
           id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          shipping: product.shipping,
          imgLink: product.imgLink,
          variety: product.variety,
          originalPrice: product.originalPrice,
          deliveryCharge: product.deliveryCharge,
          returnDays: product.returnDays,
          replacementDays: product.replacementDays,
          serviceDays: product.serviceDays,
          additionalDiscription: product.additionalDiscription,
          status:product.status,
        }));
    
        // Define CSV column headers
        const fieldNames = ["id", "name", "description", "price", "category", "stock", "shipping", "imgLink", "variety", "originalPrice", "deliveryCharge", "returnDays", "replacementDays", "serviceDays", "additionalDiscription","status"];
          
        // Create a new json2csv parser instance
        const json2csvParser = new Parser({ fields: fieldNames });
        const csv = json2csvParser.parse(fields); // Convert JSON to CSV format
    
        // Set headers for CSV file download
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=products.csv");
        
        // Send CSV file as response
        res.status(200).end(csv);
    
        console.log("CSV file successfully created.");
    
      } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
      }
    };
    export const exportUserBylast5 = async (req, res) => {
      try {
        // Fetch all products with populated user details
        const products = await Product.find({}).sort({ createdAt: -1 }).lean().limit(5);
    
        if (!products || products.length === 0) {
          return res.status(404).json({ message: "No products found to export." });
        }
    
        // Extract only required fields
        const fields = products.map((product) => ({
           id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          shipping: product.shipping,
          imgLink: product.imgLink,
          variety: product.variety,
          originalPrice: product.originalPrice,
          deliveryCharge: product.deliveryCharge,
          returnDays: product.returnDays,
          replacementDays: product.replacementDays,
          serviceDays: product.serviceDays,
          additionalDiscription: product.additionalDiscription,
          status:product.status,
        }));
    
        // Define CSV column headers
        const fieldNames = ["id", "name", "description", "price", "category", "stock", "shipping", "imgLink", "variety", "originalPrice", "deliveryCharge", "returnDays", "replacementDays", "serviceDays", "additionalDiscription","status"];
          
        // Create a new json2csv parser instance
        const json2csvParser = new Parser({ fields: fieldNames });
        const csv = json2csvParser.parse(fields); // Convert JSON to CSV format
    
        // Set headers for CSV file download
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=products.csv");
        
        // Send CSV file as response
        res.status(200).end(csv);
    
        console.log("CSV file successfully created.");
    
      } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
      }
    };
export const fetchAllProducts = async (req, res) => {
    try {
      const notes = await Product.find();
   
      res.json(notes);
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  };

  export const fetchUserProduct = async (req, res) => {
    try {
      const products = await Product.find({ user: req.user._id });
      res.status(200).send({
        products,
      });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  };
  export const getUserProducts = async (req, res) => {
    try {
      const { page = 1, limit = 10, category } = req.query;
  
      const pageNumber = Math.max(1, Number(page));
      const limitNumber = Math.min(Math.max(1, Number(limit)), 100);
  
      const query = { user: req.user._id };
      if (category) {
        query.category = category;
      }
  
      const totalProducts = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalProducts / limitNumber);
  
      // Prevent skipping all data when currentPage is greater than totalPages
      if (pageNumber > totalPages) {
        return res.json({
          products: [],
          totalProducts,
          currentPage: pageNumber,
          totalPages,
        });
      }
  
      const products = await Product.find(query)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .sort({ createdAt: -1 })
        .lean();
  
      res.status(200).json({
        products,
        totalProducts,
        currentPage: pageNumber,
        totalPages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  

  export const getProducts = async (req, res) => {
    try {
      const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  
      // Sorting products based on the custom ID (VK-001, VK-002, etc.)
      // products.sort((a, b) => {
      //   // Check if productId exists and has the expected format
      //   if (a.id && b.id) {
      //     console.log();
      //     const aId = parseInt(a.id.substring(3), 10); // Extract numeric part from VK-001
      //     const bId = parseInt(b.id.substring(3), 10);
  
      //     // Ensure parseInt successfully converted the string to a number
      //     if (!isNaN(aId) && !isNaN(bId)) {
      //       return aId - bId; // Sort in ascending order by numeric part of productId
      //     }
      //   }
      //   return 0; // If productId is missing or not in the correct format, don't change their order
      // });
  
      const outofstock = await Product.find({ stock: { $lt: 15 } }).lean();
  
      res.status(200).send({
        total_products: products.length,
        outofstock: outofstock.length,
        outofstockPd: outofstock,
        products,
      });
    } catch (error) {
        console.log(error.message);
      res.status(400).send({
        message: "Something went wrong while getting products",
    
      });
    }
  };
  
  export const getSingleProduct = async (req, res) => { 
    try {
      const id = req.params.id;
  
      const pd = await Product
        .findById(id)
        .lean();
  
      res.status(200).send({
        success: true,
        message: "Product fetched successfully",
        pd
      });
    } catch (error) {
      res.status(400).send({
        message: "something went wrong while fetching the product",
      });
    }
  };
  export const getStatus = async (req, res) => { 
    try {
      const id = req.params.id;
  
      const pd = await Product
        .findById(id)
        .lean();
  
      res.json({ status: pd.status });
    } catch (error) {
      res.status(400).send({
        message: "something went wrong while fetching the product",
      });
    }
  };
  export const setProductStatus=async (req, res) => {
    try {
      const { id } = req.params; // Get product ID from URL
      const { status } = req.body; // Get status from request body
  
      // Find and update the product status
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { status },
        { new: true } // Returns the updated product
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
  export const getProductPhoto = async (req, res) => {
    try {
      const id = req.params.id;
      const pd = await Product.findById(id).select("photo");
      if (pd && pd.photo) {
        res.set("Content-Type", "image/jpeg");
        return res.status(200).send(pd.data.photo);
      }
  
      const product = await Product.findById(req.params.pid).select("photo");
      if (product.photo.data) {
        res.set("Content-Type", "image/jpeg");
        return res.status(200).send(product.photo.data);
      }
    } catch (error) {
      res.status(400).send({
        message: "something went wrong while fetching the product photo",
      });
    }
  };


 
  export const updateProduct = async (req, res) => {
    try {
      const  id  = req.params.id;
      const {
        price,
        stock,
        originalPrice 
      } = req.body;
  
      // Find the product by ID
  
      let product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).send({ error: "Product not found" });
      }
  const newProduct = {};
      if (price) {
        newProduct.price = price;
      }
      if (stock) {
        newProduct.stock = stock;
      }
      if (originalPrice) {
        newProduct.originalPrice = originalPrice;
      }
      // Check for required fields
      // Update product fields

       product = await Product.findByIdAndUpdate(
        id,
        { $set: newProduct },
        { new: true }
      );
     // Save updated product
      res.json({ product });
    } catch (error) {
      // Log the error for debugging
      res
        .status(400)
        .send({ message: "Something went wrong while updating the product", error:error.message });
    }
  };
  
  export const deleteProduct = async (req, res) => {
    try {
      const product = await Product
        .findByIdAndDelete(req.params.id)
        .select("-photo");
  
      res.status(201).send({
        success: true,
        message: "Product deleted successfully",
        product,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Something went wrong while delteing the product",
      });
    }
  };
  
  // * Search functionality
  // export const searchProducts = async (req, res) => {
  //   try {
  //     const keyword = req.params.keyword;
  
  //     const result = await Product
  //       .find({
  //         $or: [
  //           { name: { $regex: keyword, $options: "i" } },
  //           { description: { $regex: keyword, $options: "i" } },
  //         ],
  //       })
  //       .select("-photo");
  
  //     res.json(result);
  //   } catch (error) {
  //     res.status(500).send({
  //       success: false,
  //       message: "Something went wrong while searching the product",
  //     });
  //   }
  // };
  
  export const searchProducts = async (req, res) => {
    try {
      const keyword = req.params.keyword?.trim();
      const page = parseInt(req.query.page) || 1; // Current page number
      const limit = parseInt(req.query.limit) || 10; // Results per page
      const skip = (page - 1) * limit; // Skip results for pagination
  
      if (!keyword) {
        return res.status(400).json({
          success: false,
          message: "Keyword is required for searching.",
        });
      }
  
      // Perform text search
      const textSearchResults = await Product
        .find({ $text: { $search: keyword } })
        .sort({ score: { $meta: "textScore" }, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-photo");
  
      // If text search finds results, return them
      if (textSearchResults.length > 0) {
        // console.log("The search keyword is found: ", textSearchResults);
        return res.json({
          success: true,
          results: textSearchResults,
          message: `${textSearchResults.length} products found.`,
        });
      }
  
      // console.log(
      //   "The text research result is not found so we are going for the regex search"
      // );
  
      // Fallback to regex search if text search returns no results
      const regexSearchResults = await Product
        .find({
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-photo");
  
      // Respond with fallback results or no matches
      if (regexSearchResults.length > 0) {
        return res.json({
          success: true,
          results: regexSearchResults,
          message: `${regexSearchResults.length} products found using fallback search.`,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "No products found matching your search.",
        });
      }
    } catch (error) {
      console.error("Error in searchProducts:", error);
      res.status(500).json({
        success: false,
        message: "Something went wrong while searching for products.",
      });
    }
  };
  
  // * Section one Product fetching
  
  export const getSectionOneProducts = async (req, res) => {
    try {
      const products = await Product
        .find({ stock: { $gt: 0 } })
        .sort({ createdAt: -1 }) // Sorting by `createdAt` in ascending order
        .limit(8)
        .lean(); // Limiting to 8 products
      // Debugging line
      res.json(products);
    } catch (error) {
      // Log the error for debugging
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  export const getSectionTwoProducts = async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: 1 }).limit(4).lean();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  // * function for pagination products.
  export const getkProducts = async (req, res) => {
    const { page = 1, limit = 10, category } = req.query;
  
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(Math.max(1, Number(limit)), 100);
  
    const query = category ? { category } : {};
  
    try {
      const products = await Product
        .find(query)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .sort({ createdAt: -1 })
        .lean();
  
      const totalProducts = await Product.countDocuments(query);
  
      res.json({
        products,
        totalProducts,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / limitNumber),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // * function for sending the products based on the category.
  export const getCategoryProducts = async (req, res) => {
    try {
      const { id } = req.params;
      const products = await Product.find({ category: id }).lean();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // * route for custom id search for the products
  
  export const searchAdminProducts = async (req, res) => {
    try {
      const { searchValue } = req.body;
  
      let id = `VK-${searchValue}`;
  
      const product = await Product.find({ id: id }).lean();
  
      let searchByNameProduct;
  
      if (product) {
        searchByNameProduct = await Product.find({ name: searchValue });
  
        return res.status(200).send({
          product: searchByNameProduct,
        });
      }
  
      res.status(200).send({
        product,
      });
    } catch (error) {
      res.status(500).send({
        success: "false",
        message: "Internal Server error",
      });
    }
  };
  
  // * this method is for showing the suggestion in the search bar
  export const getSuggestProducts = async (req, res) => {
    try {
      const keyword = req.params.keyword;
      const suggestions = await Product
        .find({
          name: { $regex: keyword, $options: "i" },
        })
        .select("name")
        .limit(10); // Limit the number of suggestions
  
      const suggestionList = suggestions.map((product) => product.name);
  
      res.status(200).json(suggestionList);
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Internal Server error",
      });
    }
  };
  
  // * this controller is used to get custom product id
  export const getCustomProductId = async (req, res) => {
    try {
      const products = await Product.find({}, "id").lean();
      const ids = products.map((product) => product.id);
      res.json({ success: true, data: ids });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  };