import { Link } from "react-router-dom"
import "./Navbar.scss"
function NavBar() {
  return (
    <nav className="bg-black text-white flex justify-between items-center p-6 ">
      <div className="flex items-center space-x-4">
      <Link to="/" className="hover:text-gray-300">
        <img src="/images/images__1_-removebg-preview.png" alt="Logo" className=" w-[40%]" /> 
        </Link>
        <div className="space-x-4">
          <a href="#" className="hover:text-gray-300">Ride</a>
          <a href="#" className="hover:text-gray-300">Drive</a>
          <a href="#" className="hover:text-gray-300">About</a>
        </div>
      </div>
      <div className="flex items-center space-x-8"> 
        <a href="#" className="hover:text-gray-300">Help</a>
        <Link to="/login" className="hover:text-gray-300">Login</Link>
        <Link to="/signup" className="hover:text-gray-300"> <button className="bg-white rounded text-black w-20  h-8">Sign Up</button></Link>
      </div>
    </nav>
  )
}

export default NavBar
