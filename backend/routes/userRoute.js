const express =require("express");
const router =express.Router();
const User =require("../models/userModel");
const Doctor =require("../models/doctorModel");
const Appointment=require("../models/appointmentModel");
const bcrypt =require("bcryptjs");
const jwt =require("jsonwebtoken");
const authMiddleware =require("../middlewares/authMiddlewares");
const moment =require("moment");
router.post("/register",async(req,res)=>{
    try{
       const userExist =await User.findOne({email:req.body.email});
       if(userExist){
        return res.status(200).send({message:"user already exist",success :false});
       }
       const password =req.body.password;
       const salt =await bcrypt.genSalt(10);
       const hashedPassword =await bcrypt.hash(password,salt);
       req.body.password=hashedPassword;
       const newuser =new User(req.body);
       await newuser.save();
       res.status(200).send({message: "user created successfully",success:true});
    }
    catch(error){
        console.log(error);
    res.status(500).send({message:"Error creating user",success:false,error});
    }
});

router.post("/login",async(req,res)=>{
    try{
     const user =await User.findOne({email:req.body.email});
     if(!user){
        return res.status(200).send({message: "user does not exist",success:false});
     }
     const isMatch =await bcrypt.compare(req.body.password,user.password);
     if(!isMatch){
       return res.status(200).send({message: "incorrect password",success:false});

     }
     else{
        const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"1d"
        })
        res.status(200).send({message:"login successful",success:true,data:token});
     }
    }catch(error){
        console.log(error);
        res.status(500).send({message:"Error logging in",success:false,error});
    }
});
router.post('/get-user-info-by-id',authMiddleware, async(req,res)=>{
    try{
       const user = await User.findOne({_id:req.body.userId});
       user.password=undefined;
       if(!user){
       return  res.status(200).send({message:"user does not exist",success:false});
       }
       else{
        res.status(200).send({success:true,data:user,});
       }
    }catch(error){
      res.status(200).send({message: "error getting user info",success: false,error})
    }
});
router.post("/apply-doctor-account",authMiddleware, async(req,res)=>{
    try{
       const newdoctor =new Doctor({...req.body,status:"pending"});
       await newdoctor.save();

       const adminUser =await User.findOne({isAdmin:true});
       const unseenNotification =adminUser.unseenNotification
       unseenNotification.push({
        type: "new-doctor-request",
        message: `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
         data:{
            doctorId:newdoctor._id,
            name: newdoctor.firstName + " "+ newdoctor.lastName
         },
         onClickPath: "/admin/doctorslist"
       })
       await User.findByIdAndUpdate(adminUser._id,{unseenNotification});
       res.status(200).send({
        success:true,
        message:"Doctor account applied successfully",
       });
    }
    catch(error){
        console.log(error);
    res.status(500).send({message:"Error applying doctor",success:false,error});
    }
});
router.post("/mark-all-notification-as-seen",authMiddleware, async(req,res)=>{
    try{
       const user = await User.findOne({_id:req.body.userId});
       const seenNotifications=user.seenNotifications;
       const unseenNotification=user.unseenNotification;
       seenNotifications.push(...unseenNotification);

      user.unseenNotification=[];
      user.seenNotifications=seenNotifications;
      const updatedUser =await user.save();
       updatedUser.password = undefined;
       res.status(200).send({
        success:true,
        message :"All notifications marked as seen",
       });
    }
    catch(error){
        console.log(error);
    res.status(500).send({message:"Error applying doctor",success:false,error});
    }
});
router.post("/delete-all-notifications",authMiddleware, async(req,res)=>{
    try{
       const user = await User.findOne({_id:req.body.userId});


        user.unseenNotification=[];
        user.seenNotifications=[];
        const updatedUser =await user.save();
        updatedUser.password = undefined;
       res.status(200).send({
        success:true,
        message :"All notifications marked are deleted",
       });
    }
    catch(error){
        console.log(error);
    res.status(500).send({message:"Error applying doctor",success:false,error});
    }
});
router.get("/get-all-approved-doctors",authMiddleware,async(req,res)=>{
    try{
        const doctors = await Doctor.find({status:"approved"});
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
router.post('/book-appointment',authMiddleware, async(req,res)=>{
    try{
        req.body.date =moment(req.body.date,'DD-MM-YYYY').toISOString();
        req.body.time =moment(req.body.time,'HH:mm').toISOString();
       req.body.status ="pending";
       const newAppointment =new Appointment(req.body);
       await newAppointment.save();
       //pushing notification to doctor base on his  use id
       const user =await User.findOne({_id:req.body.doctorInfo.userId});

       user.unseenNotification.push({
        type:"new-appointment-request",
        message: `A new appointment request has been made by ${req.body.userInfo.name}`,
        onClickPath:'/doctor/appointments'
       });
       await user.save();
       res.status(200).send({
        message:"Appointment booked successfully",
        success:true,
       });
 
    }catch(error){
      res.status(200).send({message: "error booking appointment",success: false,error})
    }
});
router.post('/check-booking-availability',authMiddleware, async(req,res)=>{
    try{
        const date =moment(req.body.date,'DD-MM-YYYY').toISOString();
        const fromTime= moment(req.body.time,'HH:mm').subtract(1,'hours').toISOString();
        const toTime= moment(req.body.time,'HH:mm').add(1,'hours').toISOString();
        const doctorId = req.body.doctorId;
        const appointments =await Appointment.find({
            doctorId,
            date,
            time: {$gte: fromTime, $lte: toTime}
          }) ;
 if(appointments.length>0){
    return    res.status(200).send({
        message:"Appointment not Available",
        success:false,
       });
 }else{
   return res.status(200).send({
        message:"Appointment  Available",
        success:true,
       });
 }
 
    
 
    }catch(error){
      res.status(200).send({message: "error booking appointment",success: false,error})
    }
});
router.get("/get-appointments-by-user-id",authMiddleware,async(req,res)=>{
    try{
        const appointments = await Appointment.find({userId:req.body.userId});
        res.status(200).send({
            message:"appointments fetched successfully",
            success:true,
            data:appointments,

        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            message:"error fetching appointments",
            success:false,
            error,
        });
    }
});
module.exports =router;
