import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Button, TimePicker } from 'antd';
import { Col, Form, Input, Row } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { useDispatch, useSelector } from 'react-redux';
import axios from  "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import { useNavigate, useParams } from 'react-router-dom';
import DoctorForm from '../../components/DoctorForm';
import moment from 'moment';

function Profile() {
    const dispatch =useDispatch();
    const {user} =useSelector((state)=>state.user);
    const params =useParams();
    const [doctor,setDoctor] = useState(null);
    const navigate =useNavigate();
    const onFinish = async(values) =>{
        try{
            dispatch(showLoading())
          const response =await axios.post('/api/doctor/update-doctor-profile',{...values,userId:user._id,
        timings:[
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
        ]},
          {
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
          });

          dispatch(hideLoading())
          if(response.data.success){
          toast.success(response.data.message);
          toast("Redirecting to home page");
          navigate("/");
          }else{
              toast.error(response.data.message);
          }
          }
          catch(error){
            dispatch(hideLoading())
            toast.error('something went wrong');
          }
    };
    const getDoctorData =async()=>{
        try{
             const response =await axios.post('/api/doctor/get-doctor-info-by-user-id',{
                userId:params.userId,
             },{
              headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
              }
             });
             if(response.data.success){
           setDoctor(response.data.data);
    
             }
       
        }
        catch(error){
 
        }
      };
    useEffect(()=>{
      
         getDoctorData();
        
     },[]);
  return (
   <Layout>
    <h1 className='page-title'>Doctor</h1>
    <hr/>
   {doctor && <DoctorForm onFinish={onFinish} initialValues={doctor}/>}
   </Layout>
  )
}

export default Profile