import './App.css';
import {Routes,Route} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import FacultyPage from './components/FaultyPage'
import StudentPage from './components/StudentPage'
import EditDetails from './components/EditDetails'

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginForm />} />
      <Route path='/student-page' element={<StudentPage/>} />
      <Route path='/faculty-page' element={<FacultyPage/>} />
      <Route path='/edit/:id' element={<EditDetails />}/>
    </Routes>
  );
}

export default App;
