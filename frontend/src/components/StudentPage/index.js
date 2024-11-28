import './index.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import NavBar  from '../NavBar'
const StudentPage=()=>{
    const [user, setUser]=useState()
    const [studentDetails, setStudentDetails]=useState({})
    const navigate=useNavigate()

    useEffect(()=>{
        const StudentToken=localStorage.getItem('student-access')
        const storeduser=localStorage.getItem('student-user')
        if (StudentToken){
            fetcheStudents(StudentToken)
           
        }
        else{
            navigate('/')
            return
        }

        if (storeduser){
            setUser(JSON.parse(storeduser))
        }
    }, [])

    const fetcheStudents=async (StudentToken)=>{
        console.log('student token available')
        try{
            const response= await axios.get('http://127.0.0.1:8000/api/student-profile/',{
                headers:{
                    Authorization:`Bearer ${StudentToken}`
                }
            })

            const studentsData = {
                id: response.data.id,
                userId:response.data.user_id,
                firstName: response.data.first_name,  
                lastName: response.data.last_name,    
                gender: response.data.gender,         
                dateOfBirth: response.data.date_of_birth,  
                contactNumber: response.data.contact_number, 
                address: response.data.address,       
                facultyID: response.data.faculty,  
                facultyName:response.data.faculty_name,     
                subject: response.data.subject        
            };

            setStudentDetails(studentsData)
        } catch (error){
            console.log('error is:', error)
        }

    }

    return (
        <div className='container'>
            <NavBar role={{isFaculty:false,isStudent:true}}/>
            <div className='card1 container d-flex flex-column justify-content-center align-items-center'>
                <div className=' card-2 d-flex flex-column'>
                    <img className='image mb-4' src='/images/qualification-icon-vector-image-can-be-used-business-training_120816-199098.avif' alt='student-pic'/>
                    <div className='d-flex flex-row'>
                    <div className='data-card m-4'>
                        <p className='details-para'>ID: {studentDetails.id}</p>
                        <p className='details-para'>User ID: {studentDetails.userId}</p>
                        <p className='details-para'>USername: {studentDetails.username}</p>
                        <p className='details-para'>First name: {studentDetails.firstName} {studentDetails.lastName}</p>
                    </div>   
                    <div className='data-card m-4'>
                            <p className='details-para'>Last name: {studentDetails.gender}</p>
                            <p className='details-para'>DOB: {studentDetails.dateOfBirth}</p>
                            <p className='details-para'>Contact number: {studentDetails.contactNumber}</p>
                            <p className='details-para'>Address: {studentDetails.address}</p>
                        
                    </div>
                    <div className='data-card m-4'>
                            <p className='details-para'>Faculty ID: {studentDetails.facultyID}</p>
                            <p className='details-para'>Faculty name: {studentDetails.facultyName}</p>
                            <p className='details-para'>Subject: {studentDetails.subject}</p>
                            <Link to={`/edit/${studentDetails.id}`} className='btn btn-primary'>Edit</Link>
                    
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )


}

export default StudentPage