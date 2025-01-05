
// Function to add product 

import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModel.js'

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })

        )
        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }
        console.log(productData);
        const product = new productModel(productData)
        await product.save()

        res.json({ success: true, message: "Product Added Succesfully" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }


}

// Function to list product 

const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Function to remove product 

const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed Succesfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Function to single product 

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true, product})
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }


}
const editProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, sizes, bestseller, image1, image2, image3, image4 } = req.body;

        // Handle new images if provided
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = [];
        if (images.length > 0) {
            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
        }

        // Prepare the updated product data
        const updatedProductData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            date: Date.now(),
        };

        // If new images are provided, add them to the updated product data
        if (imagesUrl.length > 0) {
            updatedProductData.image = imagesUrl;
        }

        // Update the product in the database using the provided ID
        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedProductData, { new: true });

        // Check if the product was found and updated
        if (!updatedProduct) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product Updated Successfully", product: updatedProduct });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export { addProduct, listProduct, removeProduct, singleProduct, editProduct }