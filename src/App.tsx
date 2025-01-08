
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPath from './container/auth/login';
import RegisterPage from './container/auth/Register';

function App() {
  return (
    <>
     <Router>
        <Routes>
          <Route path='/login' Component={LoginPath} />
          <Route path='/register' Component={RegisterPage} />
        </Routes>
     </Router>
    </>
  )
}

export default App
