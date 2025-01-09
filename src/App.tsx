
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPath from './container/auth/login';
import RegisterPage from './container/auth/Register';
import HomePage from './container/HomePage';
import { PrivateRoute } from './components/privateRoute';

function App() {
  return (
    <>
     <Router>
        <Routes>
          <Route path='/' Component={LoginPath} />
          <Route path='/register' Component={RegisterPage} />
          <Route element={<PrivateRoute />}>
            <Route path='/homePage' Component={HomePage} />
          </Route>
        </Routes>
     </Router>
    </>
  )
}

export default App
