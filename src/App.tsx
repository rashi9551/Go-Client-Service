import './App.scss'
import {Route,Routes,BrowserRouter, Navigate} from "react-router-dom";
import {useSelector} from 'react-redux'
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from '@chakra-ui/react';
import HomePage from './pages/user/Home/HomePage.tsx';
import LoginPage from './pages/user/Authentication/LoginPage.tsx';
import { ToastContainer } from 'react-toastify';
import DriverLoginPage from './pages/driver/Authentication/DriverLoginPage.tsx';
import DriverSignupPage from './pages/driver/Authentication/DriverSignupPage.tsx';
import SigunpPage from './pages/user/Authentication/SigunpPage.tsx';

function App() {
  const  user  = useSelector((store:{ user: { loggedIn: boolean } })=>store.user.loggedIn);
  console.log(user,"------");
  
  return (
    <>
    <ToastContainer />
    <Toaster />
    <ChakraProvider>
      <BrowserRouter>
        <Routes>

          {/* user roter  */}
              <Route path='/' element={<HomePage/>}/>
              <Route path='/login' element={user ? <Navigate to={'/'}/>:<LoginPage/>}/>
              <Route path='/signup' element={user ? <Navigate to={'/'}/>:<SigunpPage/>}/>

          {/* driver route  */}
          <Route path='/driver/login' element={<DriverLoginPage/>}/>
          <Route path='/driver/signup' element={<DriverSignupPage/>}/>


        </Routes>
      </BrowserRouter>
      </ChakraProvider>
    </>
  )
}

export default App
