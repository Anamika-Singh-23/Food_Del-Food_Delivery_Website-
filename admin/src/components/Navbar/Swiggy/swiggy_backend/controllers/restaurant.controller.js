import RestaurantModel from "../models/Restaurant.model.js";

export async function createRestaurantController(req, res) {
    try {
        const newRestaurant = await RestaurantModel.create(req.body);
        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(500).json({msg:err.message});
    }
}
export async function fetchRestaurantsController(req, res) {
    try {
        const allRestaurants = await RestaurantModel.find();
        res.status(200).json(allRestaurants);
    } catch (error) {
        res.status(500).json({msg:error.message});
    }
}   