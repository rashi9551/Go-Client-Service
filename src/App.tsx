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
import AdminLoginPage from './pages/admin/AdminLoginPage.tsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.tsx';
import AdminDriverPage from './pages/admin/adminDriver/AdminDriverPage.tsx';
import AdminDriverPendingDetails from './pages/admin/adminDriver/AdminDriverPendingDetails.tsx';
import AdminDriverDetailsVerified from './pages/admin/adminDriver/AdminVerifiedDriverPage.tsx';
import DriverDashboardPage from './pages/driver/Dashboard/DriverDashboardPage.tsx';
import AdminUserDetailsPage from './pages/admin/adminUser/AdminUserDetailsPage.tsx';

function App() {
  const  user  = useSelector((store:{ user: { loggedIn: boolean } })=>store.user.loggedIn);
  const  driver  = useSelector((store:{ driver: { loggedIn: boolean } })=>store.driver.loggedIn);
  const  admin  = useSelector((store:{ admin: { loggedIn: boolean } })=>store.admin.loggedIn);
  
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
          <Route path='/driver/login' element={driver ? <Navigate to={'/driver/dashboard'}/>:  <DriverLoginPage/>}/>
          <Route path='/driver/signup' element={driver ? <Navigate to={'/driver/dashboard'}/>:<DriverSignupPage/>}/>
          <Route path='/driver/dashboard' element={!driver ? <Navigate to={'/driver/login'}/>:<DriverDashboardPage/>}/>


          {/* admin route  */}
          <Route path='/admin/login' element={admin ? <Navigate to={'/admin/dashboard'}/>: <AdminLoginPage/>}/>
          <Route path='/admin/dashboard' element={!admin ? <Navigate to={'/admin/login'}/>:<AdminDashboardPage/>}/>
          <Route path='/admin/drivers' element={!admin ? <Navigate to={'/admin/login'}/>:<AdminDriverPage/>}/>
          <Route path="/admin/pendingDriver/:id" element={!admin ? <Navigate to={'/admin/login'} /> : <AdminDriverPendingDetails />} />
          <Route path="/admin/verifiedDriver/:id" element={!admin ? <Navigate to={'/admin/login'}/>:<AdminDriverDetailsVerified/>}/>
          <Route path="/admin/users" element={!admin ? <Navigate to={'/admin/login'}/>:<AdminUserDetailsPage/>}/>


        </Routes>
      </BrowserRouter>
      </ChakraProvider>
    </>
  )
}

export default App
