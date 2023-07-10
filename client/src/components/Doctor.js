import React from 'react'
import { useNavigate } from 'react-router-dom'

function Doctor({doctor}) {
    const navigate =useNavigate();
  return (
    <div className='card car-d p-2 cursor-pointer' onClick={()=>navigate(`/book-appointment/${doctor._id}`)}><div className='d-flex '><h1 className='card-title mr-2'>{doctor.firstName} {doctor.lastName}</h1>
    <img className='photo ' src='https://t3.ftcdn.net/jpg/01/71/98/22/240_F_171982214_jxvG1gsLCVuvdx3rd9kkFAWMzOk098qj.jpg'/> </div>
    <hr/>
    <p ><b>Phone : </b>{doctor.phoneNumber}</p>
    <p ><b>Address : </b>{doctor.address}</p>
    <p ><b>Fee per Visit : </b>{doctor.feeperConsultation}</p>
    <p ><b> Specialization : </b>{doctor. specialization}</p>
    <p ><b>Timings : </b>{doctor.timings[0]} - {doctor.timings[1]}</p>
    </div>
  )
}

export default Doctor