const express =require("express");
const router =express.Router();
const User =require("../models/userModel");
const Doctor =require("../models/doctorModel");
const bcrypt =require("bcryptjs");
const jwt =require("jsonwebtoken");
const authMiddleware =require("../middlewares/authMiddlewares");
router.get("/get-all-doctors",authMiddleware,async(req,res)=>{
    try{
        const doctors = await Doctor.find({});
        res.status(200).send({
            message:"doctors fetched successfully",
            success:true,
            data:doctors,

        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            message:"error",
            success:false,
            error,
        });
    }
});
router.get("/get-all-users",authMiddleware,async(req,res)=>{
    try{
        const users = await User.find({});
        res.status(200).send({
            message:"users fetched successfully",
            success:true,
            data:users,

        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            message:"error",
            success:false,
            error,
        });
    }
});
router.post("/change-doctor-status",authMiddleware,async(req,res)=>{
    try{
         const {doctorId,status} =req.body;
         const doctor =await Doctor.findByIdAndUpdate (doctorId,{
            status,
         });
 
       const user =await User.findOne({_id:doctor.userId});
       const unseenNotification =user.unseenNotification
       unseenNotification.push({
        type: "new-doctor-request-changed",
        message: `your doctor account has been ${status}`,
     
       onClickPath: "/notifications"
       });
      user.isDoctor=status==="approved"?true:false; 
     await user.save();

       res.status(200).send({
        success:true,
        message:"Doctor account updated successfully",
        data:doctor,
       });
     
    }catch(error){
        console.log(error);
        res.status(500).send({
            message:"error",
            success:false,
            error,
        });
    }
});
module.exports =router;