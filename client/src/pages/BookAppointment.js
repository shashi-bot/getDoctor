import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Button, DatePicker, TimePicker } from 'antd';
import { Col, Form, Input, Row } from 'antd'

import { useDispatch, useSelector } from 'react-redux';
import axios from  "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useNavigate, useParams } from 'react-router-dom';
import DoctorForm from '../components/DoctorForm';
import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function BookAppointment() {
    const {user}=useSelector((state)=>state.user);
    const[isAvailabe ,setIsAvailable] =useState(null);
    const [date,setDate] =useState();
    const [time, setTime] =useState();
    const[doctor, setDoctor] =useState(null);
    const params =useParams();
    const dispatch =useDispatch();
    const navigate=useNavigate();
    const getDoctorData =async()=>{
        try{
             const response =await axios.post('/api/doctor/get-doctor-info-by-id',{
                doctorId:params.doctorId,
             },{
              headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
              },
             });
             if(response.data.success){
           setDoctor(response.data.data);
    
             }
       
        }
        catch(error){
 
        }
      };
      const bookNow =async()=>{
        setIsAvailable(false);
        try{
            dispatch(showLoading())
            const response =await axios.post('/api/user/book-appointment',{
               doctorId:params.doctorId,
               userId:user._id,
               doctorInfo:doctor,
               userInfo:user,
               date:date,
               time:time,
            },{
             headers:{
               Authorization:`Bearer ${localStorage.getItem('token')}`
             },
            });
             dispatch(hideLoading())
            if(response.data.success){
             toast.success(response.data.message);
             navigate("/appointments");
            }
      
       }
       catch(error){
          toast.error('Error bokking appointment');
          dispatch(hideLoading());
       }
      };

      const checkAvailability =async()=>{
        try{
            dispatch(showLoading())
            const response =await axios.post('/api/user/check-booking-availability',{
               doctorId:params.doctorId,
              date:date,
              time:time,
            },{
             headers:{
               Authorization:`Bearer ${localStorage.getItem('token')}`
             },
            });
             dispatch(hideLoading())
            if(response.data.success){
             toast.success(response.data.message);
             setIsAvailable(true);
   
            }
            else{
                toast.error(response.data.message);
            }
      
       }
       catch(error){
          toast.error('Error bokking appointment');
          dispatch(hideLoading());
       }
      }

    useEffect(()=>{
      
         getDoctorData();
        
     },[]);
  return (
  <Layout>
   {doctor && (<div><h1 className='page-title'>{doctor.firstName} {doctor.lastName}</h1>
   <hr/>
  <Row gutter={40} className='mt-5' align="middle">
  <Col span={8} sm={24} xs={24} lg={8}>

<img src='https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-online-doctor-png-image_2803696.jpg'
  width="100%"
  height="400"

/>



</Col>
    <Col span={8} sm={24} xs={24} lg={8}>
    <h1 className='normal-text'><b>Timings : </b> {doctor.timings[0]} - {doctor.timings[1]}</h1>
    <p ><b>Phone : </b>{doctor.phoneNumber}</p>
    <p ><b>Address : </b>{doctor.address}</p>
    <p ><b>Fee per Visit : </b>{doctor.feeperConsultation}</p>
    <p ><b> Specialization : </b>{doctor. specialization}</p>
   <div className='d-flex flex-column pt-2 mt-2'>
    <DatePicker  format="DD-MM-YYYY"  onChange={(value)=> {
       
        setDate(dayjs(value).format("DD-MM-YYYY"));
        setIsAvailable(false);}}/>
    <TimePicker format="HH:mm"  className='mt-3' onChange={(value)=>{
        setIsAvailable(false);
        setTime(dayjs(value).format("HH:mm"));
        console.log(time);
      }}/>
   {!isAvailabe&&( <Button className='primary-button mt-3' onClick={checkAvailability}>Check Availability</Button>)}
   {isAvailabe&&( <Button className='primary-button mt-3' onClick={bookNow}>Book Now</Button>)}
   </div>
    </Col>

  </Row>

   </div>)}
  </Layout>
  )
}

export default BookAppointment