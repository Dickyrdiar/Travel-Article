
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPath from './container/auth/login';
import RegisterPage from './container/auth/Register';
import HomePage from './container/HomePage';
import { PrivateRoute } from './components/privateRoute';
import Wrapper from './container/Wrapper';
import DetaileArticle from './container/DetailArticle';
import Static from './container/Statistic';
import Categoty from './container/Category';

function App() {
  return (
    <>
     <Router>
        <Routes>
          <Route path='/' Component={LoginPath} />
          <Route path='/register' Component={RegisterPage} />
          <Route element={<PrivateRoute />}>
            <Route element={<Wrapper />}>
              <Route path='/statistic' Component={Static} />
              <Route path='/homePage' Component={HomePage} />
              <Route path='/detail-article/:id' Component={DetaileArticle} />
              <Route path='/category' Component={Categoty} />
            </Route>
          </Route>
        </Routes>
     </Router>
    </>
  )
}

export default App
