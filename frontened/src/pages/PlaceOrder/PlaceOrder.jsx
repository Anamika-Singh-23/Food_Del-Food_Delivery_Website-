import React, { useEffect } from 'react'
import './PlaceOrder.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const {getTotalCartAmount, token, food_list, cartItems, url} = useContext(StoreContext);

  const [data, setData] = useState({
    firstName:"",
    lastName: "",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]:value}))
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  // const placeOrder = async (event)=>{
  //   event.preventDefault();
  //   let orderItems = [];
  //   food_list.map((item)=>{
  //     if(cartItems[item._id]>0){
  //       let itemInfo = item;
  //       itemInfo["quantity"] = cartItems[item._id];
  //       orderItems.push(itemInfo);
  //     }
  //   })
  //   let orderData = {
  //     address: data,
  //     items: orderItems,
  //     amount: getTotalCartAmount()+2,
  //   }
  //   let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}})
  //   if(response.data.success){
  //     const {sussion_url} = response.data;
  //     window.location.replace(session_url);
  //   }
  //   else{
  //     alert("Error");
  //   }
  // }

  const placeOrder = async (event) => {
  event.preventDefault();

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay SDK");
      return;
    }
  
  let orderItems = [];
  food_list.forEach((item) => {
    if (cartItems[item._id] > 0) {
      let itemInfo = { ...item, quantity: cartItems[item._id] };
      orderItems.push(itemInfo);
    }
  });

  const orderData = {
    address: data,
    items: orderItems,
    amount: getTotalCartAmount() + 2,
    userId: localStorage.getItem("userId")
  };

  try {
    const response = await axios.post(`${url}/api/order/place`, orderData, {
      headers: {
        // Authorization: `Bearer ${token}`
        token: token
      }
    });

    if (response.data.success) {
      const { razorpayOrderId, amount, currency, key, orderId: mongoOrderId } = response.data;

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "Food Delivery App",
        description: "Order Payment",
        order_id: razorpayOrderId,
        // handler: function (response) {
        //   alert("Payment successful!");
        //   window.location.href = `${redirectUrl}&success=true`; // redirect to home or success page
        // },
        handler: function (response) {
          const paymentId = response.razorpay_payment_id;
          const signature = response.razorpay_signature;

          // Use your backend MongoDB orderId here, NOT razorpayOrderId
          window.location.href = `/verify?success=true&orderId=${mongoOrderId}&paymentId=${paymentId}&signature=${signature}`;
        },


        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone
        },
        notes: {
          address: `${data.street}, ${data.city}, ${data.state}, ${data.country}`
        },
        theme: {
          color: "#F37254"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Order creation failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error placing order");
  }
};

const navigate = useNavigate();

useEffect(() => {
  if(!token) {
    navigate('/cart')
  }
  else if(getTotalCartAmount() === 0)
  {
    navigate('/cart')
  }
},[token])

   

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="text" placeholder='  Email Address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City'/>
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State'/>
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code'/>
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country'/>
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone'/>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-deatils">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-deatils">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-deatils">
              <b>Total</b>
              <b>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO Payment</button>
        </div>
      </div>   
    </form>
  )
}

export default PlaceOrder

