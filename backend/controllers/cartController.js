import userModel from "../models/userModel.js";


const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = { size }
            cartData[itemId][size] = 1
        }
        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }


}
const updateCart = async (req, res) => {

    try {
        const { userId, itemId, size, quantity } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = userData.cartData;
    
        // Check if the quantity for the specific size is zero
        if (quantity === 0) {
            // If the item exists in the cart and it has the specified size, delete the size
            if (cartData[itemId] && cartData[itemId][size] !== undefined) {
                delete cartData[itemId][size]; // Remove the size from the item
                
                // If the item has no sizes left, delete the entire item
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId]; // Remove the entire item if no sizes are left
                }
            }
        } else {
            // If the quantity is not zero, update the quantity for the specific size
            if (cartData[itemId]) {
                cartData[itemId][size] = quantity;
            } else {
                cartData[itemId] = { [size]: quantity }; // Add new item if not present
            }
        }
    
        // Now, loop through all items in the cart to check if any item should be deleted
        for (let itemId in cartData) {
            let shouldDeleteItem = true; // Flag to determine if the entire item should be deleted
    
            // Loop through all sizes for this item
            for (let size in cartData[itemId]) {
                const itemQuantity = cartData[itemId][size];
                
                // If any size has a quantity greater than zero, do not delete this item
                if (itemQuantity > 0) {
                    shouldDeleteItem = false;
                    break;
                }
            }
    
            // If all sizes for the item have zero quantity, delete the item from the cart
            if (shouldDeleteItem) {
                delete cartData[itemId];
            }
        }
    
        // Update the user's cart data in the database
        await userModel.findByIdAndUpdate(userId, { cartData });
    
        res.json({ success: true, message: "Cart Updated!!!" });
    
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
    
    
    


}



const getUserCart = async (req, res) => {


    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;
        res.json({ success: true, cartData });

        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}





export { addToCart, updateCart, getUserCart }