import React, { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://food-del-backend-aj7d.onrender.com"
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([])

  // const addToCart = (itemId) => {
  //   setCartItems((prev) => ({
  //     ...prev,
  //     [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
  //   }));
  // };
  const addToCart = async (itemId)=> {
    if(!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1}))
    }
    else{
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
    }
    if(token){
      await axios.post(url+"/api/cart/add", {itemId},{headers:{token}})
    }
  }

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1}));
    if(token) {
      await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for(const item in cartItems)
    {
      if(cartItems[item] > 0){
        let itemInfo = food_list.find((product)=> product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  }

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list")
    setFoodList(response.data.data);
  }

  const loadCartData = async () => {
    const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
    setCartItems(response.data.cartData || {});
  }

  useEffect(() => {
  async function loadData() {
    await fetchFoodList();
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken); // ✅ set token first
      const response = await axios.post(url + "/api/cart/get", {}, {
        headers: { token: savedToken }
      });
      setCartItems(response.data.cartData || {});
    }
  }
  loadData();
}, []);

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    setCartItems,
    getTotalCartAmount,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
