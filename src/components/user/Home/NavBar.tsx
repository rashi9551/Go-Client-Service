import { Link } from "react-router-dom"
import "./Navbar.scss"
import { useDispatch, useSelector } from "react-redux"
import { userLogout } from "../../../service/redux/slices/userAuthSlice"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch=useDispatch()
  const  user  = useSelector((store:{ user: { user: string } })=>store.user.user);
  console.log(user,"user");
  
  // const user="rashi"
  const navigate=useNavigate()
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  useEffect(()=>{
    if(windowSize > 400){
        setIsOpen(false)
    }
},[windowSize])

useEffect(() => {
  const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
  };

  window.addEventListener('resize', handleWindowResize);

  return () => {
      window.removeEventListener('resize', handleWindowResize);
  };
}, []);
  return (
    <nav className="bg-black text-white flex justify-between items-center p-6 ">
      <div className="flex items-center space-x-4">
      <Link to="/" className="hover:text-gray-300">
        <img src="/images/images__1_-removebg-preview.png" alt="Logo" className=" w-[40%]" /> 
        </Link>
       
      </div>
      <div className="flex items-center mr-16 space-x-8"> 
        
          <a href="#" className="hover:text-gray-300">Home</a>
          <a href="#"  className="hover:text-gray-300">Ride</a>
          <a href="#" onClick={()=>navigate('/driver/login')} className="hover:text-gray-300">Drive</a>
          <a href="#" className="hover:text-gray-300">Account</a>
        <a href="#" className="hover:text-gray-300">About</a>

        {user?(<>

          <button onClick={() => setIsOpen(!isOpen)} className="profile-avatar">
  {user[0]}
</button>
{isOpen && (
              <div className="options-box">
                <ul>
                  <li onClick={() =>{ dispatch(userLogout())
                    navigate('/login')
                  }}>Logout</li>
                  <li onClick={() => navigate("/driver/login")}>Login as Driver</li>
                </ul>
              </div>
            )}
        </>

        ):(
          <>
        <button onClick={()=>navigate('/login')} className="text-white w-20  h-8">Login</button>
        <button onClick={()=>navigate('/signup')} className="Signup bg-white rounded text-black w-20  h-8">Signup</button>

          </>
        )}
      </div>
    </nav>
  )
}

export default NavBar
