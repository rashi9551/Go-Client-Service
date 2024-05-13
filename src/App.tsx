import './App.scss'
import {Route,Routes,BrowserRouter} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from '../src/pages/user/Home/HomePage.tsx';
import LoginPage from './pages/user/Authentication/Login/LoginPage.tsx';
import Signup from './pages/user/Authentication/Signup/Signup.tsx';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
    <ToastContainer />
    <Toaster />
      <BrowserRouter>
        <Routes>
              <Route path='/' element={<HomePage/>}/>
              <Route path='/login' element={<LoginPage/>}/>
              <Route path='/signup' element={<Signup/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
