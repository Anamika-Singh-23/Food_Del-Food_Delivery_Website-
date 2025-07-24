import { createRestaurantController, fetchRestaurantsController } from "../controllers/restaurant.controller.js";

function restaurantRoutes(app) {
    app.get('/api/restaurants', fetchRestaurantsController),

    app.post('/api/restaurant', createRestaurantController);
}

export default restaurantRoutes;