import orderModel from "../models/orderMosel.js";
import userModel from '../models/userModel.js'
import Razorpay from "razorpay";
import dotenv from "dotenv";
import { log } from "console";
dotenv.config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


//placing user oder for frontened
const placeOrder = async(req, res) => {

    const frontend_url = "http://localhost:5174";
    
    try {
        const {items, amount, address } = req.body;
        const userId = req.user.id; // Get user ID from auth middleware
  
      // ✅ Create and save order in DB
        const newOrder = await orderModel.create({
          userId,
          items,
          amount,
          address
        });
          // 2. Clear user cart
        await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}});

//         const line_items = req.body.items.map((item)=>({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:item.name
//                 },
//                 unit_amount:item.price*100*80
//             },
//             quantity:item.quantity
//         }))

//         line_items.push({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:"Delivery Changes"
//                 },
//                 unit_amount:2*100*80
//             },
//             quantity:1
//         })

//         const session = await stripe.checkout.sessions.create({
//             line_items:line_items,
//             mode:"payment",
//             success_url:`${frontend_url}/verify?success=true&orderId=${newOrder,_id}`,
//             cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder,_id}`
//         })

//         res.json({success:true, session_url:session.url})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:"Error"});
//     }
// }

// 3. Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `receipt_order_${newOrder._id}`,
    });

    res.json({
      success: true,
      orderId: newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID, // to use in frontend
      redirectUrl: `${frontend_url}/verify?orderId=${newOrder._id}`
    });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOrder = async (req, res) =>{
  const {orderId, success} = req.body;
  try{
    if(success=="true"){
      await orderModel.findByIdAndUpdate(orderId,{payment: true});
      res.json({success:true, message:"Payment Successful"})
    }
    else{
      await orderModel.findByIdAndDelete(orderId);
      res.json({success:false, message: "Payment Failed, Order Deleted"})
    }
  }catch(error){
    console.log("Verification Error:", error);
    res.json({success:false, message:"Verification Failed"})
  }
}

const userOrders = async (req, res) => {
  try {
    const userId = req.user?.id; // ✅ Fix: Use `id` instead of `userId`

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID not found in request' });
    }

    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    console.error("User Orders Error:", err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

//Listing ordres for admin panel
const listOrders = async (req, res) => {
  try{
    const orders = await orderModel.find({});
    res.json({success:true, data:orders})
  }catch(error){
    console.log(error);
    res.json({success:false, message:"Error"});
  }
}

// api for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
    res.json({success:true, message:"Status Updated"})
  } catch (error) {
    console.log("Update Status Error:", error);
    res.json({success:false, message:"Error updating status"});
  }
};

export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus}