import './index.css'
import { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const LoginForm=()=>{
    const [username, setusername]=useState('')
    const [password, setPassword]=useState('')
    const [selectOne, setSelectone]=useState({faculty:false, student:false})
    const navigate=useNavigate()

    const handleRadioInput=(event)=>{
        const {name, checked}=event.target

        setSelectone({
            ...selectOne,
            [name]:checked,
        })
    }

    const handleSubmit= async(e)=>{
        e.preventDefault()
        if (selectOne.faculty===true){
            try{
                const response= await axios.post("http://127.0.0.1:8000/api/faculty-login/", {
                    username,
                    password,
                })

                const {access, refresh, user}=response.data
                localStorage.setItem('faculty-access', access)
                localStorage.setItem('faculty-refresh',refresh)
                localStorage.setItem('faculty-user', JSON.stringify(user))
                navigate('/faculty-page')
            }catch(error){
                console.log('error is', error)
            }
        }

        else if (selectOne.student===true){
            try{
                const response= await axios.post("http://127.0.0.1:8000/api/student-login/", {
                    username,
                    password,
                })

                const {access, refresh, user}=response.data
                localStorage.setItem('student-access', access)
                localStorage.setItem('student-refresh',refresh)
                localStorage.setItem('student-user', JSON.stringify(user))
                navigate('/student-page')
            }catch(error){
                console.log('error is', error)
            }
        }
    }

    return (
        <div className="login-card bg-white d-flex flex-row justify-content-center align-items-center">
            <form className="form-container-login p-4 d-flex flex-column justify-content-between shadow rounded" onSubmit={handleSubmit}>
                <div className="inputcard d-flex flex-column ">
                    <label htmlFor="usernameid" className="label text-align-start">Username</label>
                    <input id='usernameid' className="input" placeholder="Enter username"
                    type="text"
                    value={username}
                    onChange={(e)=>setusername(e.target.value)} 
                    required/>
                </div>
                <div className="inputcard d-flex flex-column">
                    <label htmlFor="passwordid"  className="label">Password</label>
                    <input id="passwordid" className="input" placeholder="Enter password"
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)} 
                    required/>
                </div>

                <div className="d-flex flex-row"> 
                    <div className="d-flex flex-row">
                        <input  className="input2" id="radio1"
                            type="radio"
                            name='faculty'
                            checked={selectOne.faculty}
                            onChange={handleRadioInput} 
                            />
                        <label htmlFor="radio1" className="label2 ms-2">Faculty</label>    
                    </div>

                    <div className="d-flex flex-row ms-4">
                        <input className="input2" id="radio2"
                            type="radio"
                            name='student'
                            checked={selectOne.student}
                            onChange={handleRadioInput} 
                            />
                        <label htmlFor="radio2" className="label2 ms-2">Student</label>    
                    </div>

                </div>
                <button className="btn btn-primary" type="submit">Login</button>
            </form>
        </div>
    )

}

export default LoginForm