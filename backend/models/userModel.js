import mongooose from "mongoose"

const userSchema = new mongooose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    cartData:{type:Object, default:{}}
},{minimize:false})

const userModel = mongooose.models.user || mongooose.model("user",userSchema);
export default userModel;