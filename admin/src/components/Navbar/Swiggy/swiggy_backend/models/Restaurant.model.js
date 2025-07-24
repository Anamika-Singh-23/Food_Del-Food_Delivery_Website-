import mongoose from 'mongoose';
const {Schema} = mongoose;

const restaurantSchema = new mongoose.Schema({
    name: String,
    deliveryTime: String,
    imageURL:String ,
    cuisines: String,
    rating: String,
    address: String,
});

const RestaurantModel = mongoose.model('Restaurant', restaurantSchema);
export default RestaurantModel;