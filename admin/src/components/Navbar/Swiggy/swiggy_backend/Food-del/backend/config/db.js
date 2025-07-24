import mongoose from 'mongoose';

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://anamika:23092004@cluster0.sqimt4t.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}
