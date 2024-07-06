// import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { useDispatch, useSelector } from "react-redux";
import { driverLogout } from "../../../src/service/redux/slices/driverAuthSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function DirverNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const driver = useSelector(
    (store: { driver: { name: string } }) => store.driver.name
  );
  console.log(driver,"dffdf");
  
  const dispatch = useDispatch();

  const [windowSize, setWindowSize] = useState(window.innerWidth);
  useEffect(() => {
    if (windowSize > 400) {
      setIsOpen(false);
    }
  }, [windowSize]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  return (
    <div>
      {/* naavbar */}
      <nav className="bg-black text-white flex justify-between items-center p-6 ">
        <div className="flex items-center space-x-4">
          <Link to="/driver/dashboard" className="hover:text-gray-300">
            <img
              src="/images/images__1_-removebg-preview.png"
              alt="Logo"
              className=" w-[40%]"
            />
          </Link>
        </div>
        <div className="flex items-center mr-16 space-x-8">
          <a onClick={()=>navigate('/driver/dashboard')} href="#" className="hover:text-gray-300">
            Dashboard
          </a>
          <a href="#" onClick={()=>navigate('/driver/rides')} className="hover:text-gray-300">
            Ride
          </a>
          <a
            href="#"
            onClick={() => navigate("/driver/profile")}
            className="hover:text-gray-300"
          >
            Profile
          </a>
          <a href="#"
          onClick={() => navigate("/driver/About")}
           className="hover:text-gray-300">
            About
          </a>

          {driver ? (
            <>
              <button
                onClick={() =>{ setIsOpen(!isOpen)}}
                className="profile-avatar"
              >
                {driver[0]}
              </button>
              {isOpen && (
                <div className="options-box">
                  <ul>
                    <li
                      onClick={() => {
                        dispatch(driverLogout());
                        localStorage.removeItem("driverToken")
                      }}
                    >
                      Logout
                    </li>
                    <li onClick={() => navigate("/driver/signup")}>Signup</li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("driver/login")}
                className="text-white w-20  h-8"
              >
                Login
              </button>
              <button
                onClick={() => navigate("driver/signup")}
                className="Signup bg-white rounded text-black w-20  h-8"
              >
                Signup
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}

export default DirverNavbar
