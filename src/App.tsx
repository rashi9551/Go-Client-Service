import './App.scss'
import {Route,Routes,BrowserRouter,Navigate} from "react-router-dom";

import LoginPage from '../src/pages/user/Authentication/Login/LoginPage'
import HomePage from './pages/user/Home/HomePage.tsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
              <Route path='/' element={<HomePage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
