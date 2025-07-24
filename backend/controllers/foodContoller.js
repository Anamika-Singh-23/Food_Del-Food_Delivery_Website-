import FoodModel from "../models/foodModel.js";
import fs from "fs";

//add food item
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const image_filename = req.file.filename;

        const food = new FoodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename
        });

        await food.save();

        res.json({
            success: true,
            message: "Food Added"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error in adding food item" });
    }
};


//all food list
const listFood = async(req, res)=>{
    try{
        const foods = await FoodModel.find({});
        res.json({success: true, data: foods});
    }catch(error){
        console.log(error);
        res.json({success: false, message: "Error in fetching food items"});
    }
}

//remove food item
const removeFood = async(req, res)=>{
    try{
        const food = await FoodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, (err) => {})

        await FoodModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "Food item removed successfully"});
    }catch(error){
        console.log(error);
        res.json({success: false, message: "Error in removing food item"});
    }
}
export {addFood, listFood, removeFood};
