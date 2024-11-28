import './index.css'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

const NavBar=(props)=>{
    const {role}=props
    const navigate=useNavigate()
    const homeroute=role.isFaculty? '/faculty-page':'/student-page'
    
    const handlelogout=()=>{
        localStorage.clear()
        navigate('/')
    }
   
    return (
        <Navbar className='navbar-background'>
            <Container>
                <Navbar.Brand className='nav-text' as={Link} to={homeroute}>College</Navbar.Brand>
                <Nav className='ms-auto'>
                    <Nav.Link className='nav-text' as={Link} to={homeroute}>Home</Nav.Link>
                    <Nav.Link className='nav-text'>About college</Nav.Link>
                    <Nav.Link className='nav-text'>Courses</Nav.Link>
                    <Nav.Link className='nav-text'>Contact</Nav.Link>
                    <Nav.Link className='nav-text' onClick={handlelogout}>Logout</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavBar