import React from "react";
import {Button, Form,Input} from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from  "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
function Register() {
  const dispatch=useDispatch();
  const navigate =useNavigate();

  const onFinish = async (values)=>{
    try{
      dispatch(showLoading())
    const response =await axios.post('/api/user/register',values);
    dispatch(hideLoading())
    if(response.data.success){
    toast.success(response.data.message);
    toast("Redirecting to login page");
    navigate("/login");
    }else{
        toast.error(response.data.message);
    }
    }
    catch(error){
      dispatch(hideLoading())
      toast.error('something went wrong');
    }
  };
  return (
   <div className='authentication'>
    <div className='authentication-form card p-3'>
      <h1 className='card-title'>Nice to meet you</h1>
      <Form layout='vertical' onFinish={onFinish}>
        <Form.Item label ='Name' name='name'>
        <Input placeholder ='Name'/>

        </Form.Item>
        <Form.Item label ='Email' name='email'>
        <Input placeholder ='email'/>

        </Form.Item>
        <Form.Item label ='Password' name='password' >
        <Input placeholder ='password' type='password'/>

        </Form.Item>
        <div className="d-flex justify-content-between align-items-center">
        <Button className='primary-button my-2 ' htmlType='submit'>REGISTER</Button>
        <Link className='anchor 'to='/login'>Click Here To Login</Link></div>
      </Form>
    </div>
   </div>
  )
}

export default Register;