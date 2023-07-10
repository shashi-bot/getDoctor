import React, { useState } from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import '../layout.css'
import { useSelector } from 'react-redux';
import { Badge } from 'antd';

function Layout({children}) {
    const [collapsed,setCollapsed]=useState(false);
    const {user} =useSelector((state)=>state.user);
   
    const navigate =useNavigate();
    const location =useLocation();
    const userMenu=[
        {
            name:'Home',
            path:'/',
            icon:'ri-home-3-line'
        },
        {
            name: 'Appointments',
            path: '/appointments',
            icon: 'ri-file-list-line'
        },
        {
            name: 'ApplyDoctor',
            path: '/apply-doctor',
            icon: 'ri-hospital-line'

        },
     
 
    ];
    const doctorMenu=[
        {
            name:'Home',
            path:'/',
            icon:'ri-home-3-line'
        },
        {
            name: 'Appointments',
            path: '/doctor/appointments',
            icon: 'ri-file-list-line'
        },
   
        {
            name:'Profile',
            path: `/doctor/profile/${user?._id}`,
            icon: 'ri-user-line'
        },
 
    ];
    const adminMenu=[
        {
            name:'Home',
            path:'/',
            icon:'ri-home-3-line'
        },
         {
           name:"Users",
           path: "/admin/userslist",
           icon:"ri-user-line",
         },
         {
            name:"Doctors",
            path: "/admin/doctorslist",
            icon:"ri-user-star-line",
         },
        {
            name:'Profile',
            path: '/profile',
            icon: 'ri-user-line'
        }

    ];
    const menuToBeRendered = user?.isAdmin?adminMenu:user?.isDoctor? doctorMenu:userMenu;
    const role =user?.isAdmin? "Admin":user?.isDoctor? "Doctor": "User";
  return (
    <div className='main p-2'>
        <div className='d-flex layout'>
           <div className='sidebar'>
            <div className='sidebar-header'>
                <div className='d-flex '><h1 className='logo'>gD </h1>
                {!collapsed && <img className="photo p-3" src='https://t4.ftcdn.net/jpg/01/05/87/39/240_F_105873997_wItdPBj2S96YfgPQYK11079yZXu7pBFc.jpg'/>}</div>
                <h1 className='role'>{role}</h1>
            </div>
            <div className='menu'>
            {menuToBeRendered.map((menu)=>{
                const isActive =location.pathname===menu.path
                return (<div className={`d-flex menu-item ${isActive && `active-menu-item`}`}>
                <i className={menu.icon}></i>
                {!collapsed && <Link to ={menu.path}>{menu.name}</Link>}
                </div>);
            })}
            <div className={`d-flex menu-item`} onClick={()=>{
                localStorage.clear();
                navigate('/login');
            }}>
                <i className='ri-logout-box-r-line'></i>
                {!collapsed && <Link to ='/login'>Logout</Link>}
                </div>
            </div>
           </div>
           <div className='content'>
            <div className='header'>
            {!collapsed ?( <i className="ri-close-fill header-action-icon" onClick={()=>setCollapsed(true)}></i>):(<i className="ri-menu-line header-action-icon" onClick={()=>setCollapsed(false)}></i>)}
            <img  className='photo p-3' src='https://t4.ftcdn.net/jpg/03/01/86/59/240_F_301865966_uaVgTfcTqGRxDZnvSNJiQ54nyK4oqfMa.webp'/>
            <div className='d-flex align-items-center px-4'>
            
            <Badge count={user?.unseenNotification.length} offset={[-4, 5]} onClick={()=>navigate('/notifications')}>
            <i className="ri-notification-4-line header-action-icon px-2"></i>
             </Badge>
         
            <Link to='/profile' className='anchor-n mx-3'>{user?.name}</Link>

            </div>
            </div>
            <div className='body'>
                {children}
            </div>
           </div>
        </div>
    </div>
  )
}

export default Layout