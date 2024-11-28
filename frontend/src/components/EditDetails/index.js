import './index.css'
import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../NavBar'
import axios from "axios"

const EditDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [isFaculty, setIsFaculty] = useState(false)
    const [student, setStudent] = useState({})
    const [error, setError] = useState("")

    const fetchAndSetStudent = async () => {
        const facultyToken = localStorage.getItem('faculty-access')
        const studentToken = localStorage.getItem('student-access')

        if (facultyToken) {
            try {
                const response = await axios.put(`https://college-management-3-4o1u.onrender.com/api/update-student/${id}/`, {}, {
                    headers: {
                        Authorization: `Bearer ${facultyToken}`,
                    },
                })
                setStudent(response.data)
                setIsFaculty(true)
            } catch (err) {
                setError("Failed to fetch student details as faculty.")
                console.error(err)
            }
        } else if (studentToken) {
            try {
                const response = await axios.put(`https://college-management-3-4o1u.onrender.com/api/update-student-self/${id}/`, {}, {
                    headers: {
                        Authorization: `Bearer ${studentToken}`,
                    },
                })
                setStudent(response.data)
            } catch (err) {
                setError("Failed to fetch your student details.")
                console.error(err)
            }
        } else {
            navigate("/login")
        }
    }

    useEffect(() => {
        fetchAndSetStudent()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setStudent((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        const facultyToken = localStorage.getItem('faculty-access')
        const studentToken = localStorage.getItem('student-access')

        try {
            if (facultyToken) {
                await axios.put(`https://college-management-3-4o1u.onrender.com/api/update-student/${id}/`, student, {
                    headers: {
                        Authorization: `Bearer ${facultyToken}`,
                    },
                })
                alert("Student details updated successfully!")
                navigate('/faculty-page')
            } else if (studentToken) {
                await axios.put(`https://college-management-3-4o1u.onrender.com/api/update-student-self/${id}/`, student, {
                    headers: {
                        Authorization: `Bearer ${studentToken}`,
                    },
                })
                alert("Your details updated successfully!")
                navigate('/student-page')
            } else {
                setError("Unauthorized to update details.")
            }
        } catch (err) {
            setError("Failed to update details. Please try again.")
            console.error(err)
        }
    }

    if (error) {
        return <div className="error">{error}</div>
    }

    return (
        <div className='container'>
            <NavBar role={isFaculty} />
            <div className='container edit-page d-flex flex-column justify-content-center align-items-center '>
                <form className='form-container2 p-4 shadow rounded' onSubmit={handleUpdate}>
                    <div className="d-flex flex-column mb-3">
                        <label className="label">Gender</label>
                        <input
                            type="text"
                            className="input"
                            name="gender"
                            value={student.gender || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <label className="label">DOB: YYYY-MM-DD</label>
                        <input
                            type="text"
                            className="input"
                            name="date_of_birth"
                            value={student.date_of_birth || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <label className="label">Contact Number</label>
                        <input
                            type="text"
                            className="input"
                            name="contact_number"
                            value={student.contact_number || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <label className="label">Address</label>
                        <textarea
                            className="input"
                            name="address"
                            value={student.address || ""}
                            onChange={handleChange}
                            required></textarea>
                    </div>
                    <button type="submit" className="btn btn-success">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default EditDetails;
