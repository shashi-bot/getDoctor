import React from "react";
import {Button, Form,Input} from "antd";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios"
import { useSelector,useDispatch} from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
function Login() {

  const {loading} = useSelector(state=>state.alerts);
  console.log(loading);
  const navigate =useNavigate();
  const dispatch =useDispatch();
  const onFinish = async (values)=>{
    try{
      dispatch(showLoading())
    const response =await axios.post('/api/user/login',values);
    dispatch(hideLoading())
    if(response.data.success){
    toast.success(response.data.message);
    toast("Redirecting to home page");
    localStorage.setItem("token",response.data.data);
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
  return (
   <div className='authentication'>
    <div className='authentication-form card p-3'>
      <h1 className='card-title'>welcome back</h1>
      <Form layout='vertical' onFinish={onFinish}>
        
        <Form.Item label ='Email' name='email'>
        <Input placeholder ='email'/>

        </Form.Item>
        <Form.Item label ='Password' name='password' >
        <Input placeholder ='password' type='password'/>

        </Form.Item>
        <div className="d-flex justify-content-between align-items-center">
        <Button className='primary-button my-2' htmlType='submit'>LOGIN</Button>
        <Link className='anchor 'to='/register'>Click Here To Register</Link></div>
      </Form>
    </div>
   </div>
  )
}

export default Login;