import './index.css'
import { useState, useEffect, } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Table } from 'react-bootstrap'
import NavBar from '../NavBar'
import axios from "axios"

const FacultyPage=()=>{
    const [user,setUser]=useState(null)
    const navigate=useNavigate()
    const [studentsList, setStudentsList]=useState([])
    const [newStudent, setNewStudent] = useState({
        username: "",
        password:'',
        first_name: "",
        last_name: "",
        gender: "",
        date_of_birth: "",
        contact_number: "",
        address: "",
        faculty: "",
        is_student:true,
        is_faculty:false,
        subject: "",
    })


    useEffect(()=>{
        const facultyToken=localStorage.getItem('faculty-access')
        const storeduser=localStorage.getItem('faculty-user')
        if (facultyToken){
            fetcheStudents(facultyToken)
        }
        else{
            navigate('/')
            return
        }

        if (storeduser){
            setUser(JSON.parse(storeduser))
        }
    }, [])

    const fetcheStudents=async (facultyToken)=>{
        try{
            const response=await axios.get('https://college-management-3-4o1u.onrender.com/api/view-all-students/', {
                headers:{
                    Authorization: `Bearer ${facultyToken}`
                }
            })

            const studentsData=response.data.map((each)=>({
                id:each.id,
                userId:each.user_id,
                username:each.username,
                firstName:each.first_name,
                lastName:each.last_name,
                gender: each.gender,         
                dateOfBirth: each.date_of_birth,  
                contactNumber: each.contact_number, 
                address: each.address,       
                facultyID: each.faculty, 
                facultyName:each.faculty_name,      
                subject: each.subject 
            }))

            setStudentsList(studentsData)

        }catch (error){
            console.log('error is: ', error)
        }
    }

    const handleSubmit=async (e)=>{
        e.preventDefault()

        const facultytoken=localStorage.getItem('faculty-access')
        if (!facultytoken){
            alert("please login")
            return
        }

        try{
            const response=await axios.post('https://college-management-3-4o1u.onrender.com/api/create-student/', newStudent, {
                headers:{
                    Authorization: `Bearer ${facultytoken}`
                }
            })

            alert ('Student created successfully')

            setNewStudent({
                username: "",
                password:'',
                email:'',
                first_name: "",
                last_name: "",
                gender: "",
                date_of_birth: "",
                contact_number: "",
                address: "",
                faculty: "",
                is_student:true,
                is_faculty:false,
                subject: "",
            })

            fetcheStudents(facultytoken)

        }catch (error){
            console.log("error is: ", error)
        }
    }

    const addtoself = async (id) => {
        const facultytoken = localStorage.getItem('faculty-access');
        if (!facultytoken) {
            alert("Please login");
            return;
        }
    
        try {
            const response = await axios.post(
                `https://college-management-3-4o1u.onrender.com/api/add-to-self/${id}/`, 
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${facultytoken}`,
                    },
                }
            );
            alert('Added successfully');
        } catch (error) {
            console.error("Error adding to self:", error.response || error);
            alert("Failed to add to self.");
        }
    };

    return (
        <div className="container">
            <NavBar role={{isFaculty:true,isStudent:false}}/>
            {user && (
                <div className="header-card p-4 mb-3">
                    <h1>Welcome, {user.first_name} {user.last_name}</h1>
                    <p>Email: {user.email}</p>
                </div>
            )}

            <div className="d-flex flex-column justify-content-center align-items-center p-4">
                <form className="form-container d-flex flex-column justify-content-between shadow rounded p-4" onSubmit={handleSubmit}>
                    <div className="input-card d-flex flex-column mb-2">
                        <label className="label" htmlFor="username">Username</label>
                        <input id="username" className="input" placeholder="Enter username"
                        type="text" value={newStudent.username} onChange={(e)=>setNewStudent({...newStudent, username:e.target.value})} />
                    </div>

                    <div className="input-card d-flex flex-column mb-2 d-flex flex-column mb-2">
                        <label className="label" htmlFor="password">Password</label>
                        <input id="password" className="input" placeholder="Enter password"
                        type="password" value={newStudent.password} onChange={(e)=>setNewStudent({...newStudent, password:e.target.value})} />
                    </div>

                    <div className="input-card d-flex flex-column mb-2">
                        <label className="label" htmlFor="first">First name</label>
                        <input id="first" className="input" placeholder="Enter first name"
                        type="text" value={newStudent.first_name} onChange={(e)=>setNewStudent({...newStudent, first_name:e.target.value})} />
                    </div>

                    <div className="input-card d-flex flex-column mb-2">
                        <label className="label" htmlFor="last">Last name</label>
                        <input id="last" className="input" placeholder="Enter last name"
                        type="text" value={newStudent.last_name} onChange={(e)=>setNewStudent({...newStudent, last_name:e.target.value})} />
                    </div>

                    <div className="input-card d-flex flex-column mb-2">
                        <label className="label" htmlFor="gender">Gender</label>
                        <input id="gender" className="input" placeholder="Enter your gender"
                        type="text" value={newStudent.gender} onChange={(e)=>setNewStudent({...newStudent, gender:e.target.value})} />
                    </div>

                    <div className="input-card d-flex flex-column mb-2">
                        <label className="label" htmlFor="dob">Date of birth : YYYY-MM-DD</label>
                        <input id="dob" className="input" placeholder="Enter DOB"
                        type="text" value={newStudent.date_of_birth} onChange={(e)=>setNewStudent({...newStudent, date_of_birth:e.target.value})} />
                    </div>

                    <div className="input-card d-flex flex-column mb-2">
                        <label className="label" htmlFor="contact">Contact number</label>
                        <input id="contact" className="input" placeholder="Enter contact number"
                        type="text" value={newStudent.contact_number} onChange={(e)=>setNewStudent({...newStudent, contact_number:e.target.value})} />
                    </div>

                    <div className="input-card d-flex flex-column mb-2">
                        <label className="label" htmlFor="address">Address</label>
                        <textarea id="address" className="input" placeholder="Enter address"
                         value={newStudent.address} onChange={(e)=>setNewStudent({...newStudent, address:e.target.value})}></textarea> 
                    </div>

                    <div className="input-card d-flex flex-column mb-2">
                        <label className="label" htmlFor="faculty">Faculty id eg:1,2,3</label>
                        <input id="faculty" className="input" placeholder="Enter faculty id"
                        type="text" value={newStudent.faculty} onChange={(e)=>setNewStudent({...newStudent, faculty:e.target.value})} />
                    </div>

                    <div className="input-card d-flex flex-column mb-2">
                        <label className="label" htmlFor="subject">Subject</label>
                        <input id="subject" className="input" placeholder="Enter subject"
                        type="tect" value={newStudent.subject} onChange={(e)=>setNewStudent({...newStudent, subject:e.target.value})} />
                    </div>

                    <button className="btn btn-primary" type="submit">Create</button>
                </form>

                <div className="container mt-4 p-2">
                    <h1 className="tableheading mb-4">Students list</h1>
                    <table className="table table-striped table-bordered">
                        <thead className="table-head">
                            <tr>
                                <th className="head">
                                    ID
                                </th>
                                <th className="head">
                                    User ID
                                </th>
                                <th className="head">
                                    User name

                                </th>
                                <th className="head">
                                    First name

                                </th>
                                <th className="head">
                                    Last name

                                </th>
                                <th className="head">
                                    Gender

                                </th>
                                <th className="head">
                                    Date of Birth

                                </th>
                                <th className="head">
                                    Contact Number

                                </th>
                                <th className="head">
                                    Address

                                </th>
                                <th className="head">
                                    Faculty ID
                                </th>
                                <th className="head">
                                    Faculty name

                                </th>
                                <th className="head">
                                    Subject
                                </th>
                                <th className="head">
                                    Edit Details
                                </th>
                                <th className="head">
                                    Add
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {studentsList.map((each)=>(
                                <tr key={each.id}>
                                    <td className="table-content">{each.userId}</td>
                                    <td className="table-content">{each.id}</td>
                                    <td className="table-content">{each.username}</td>
                                    <td className="table-content">{each.firstName}</td>
                                    <td className="table-content">{each.lastName}</td>
                                    <td className="table-content">{each.gender}</td>
                                    <td className="table-content">{each.dateOfBirth}</td>
                                    <td className="table-content">{each.contactNumber}</td>
                                    <td className="table-content">{each.address}</td>
                                    <td className="table-content">{each.facultyID}</td>
                                    <td className="table-content">{each.facultyName}</td>
                                    <td className="table-content">{each.subject}</td>
                                    <td className="table-content"><Link to={`/edit/${each.id}`} className="btn btn-warning">Edit</Link></td>
                                    <td className="table-content" ><button className="btn btn-primary" onClick={()=>addtoself(each.id)}>Add</button></td>
                                </tr>
                                
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )
}

export default FacultyPage