import Footer from "../../../components/user/Home/Footer";
// import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { useDispatch, useSelector } from "react-redux";
import { driverLogout } from "../../../service/redux/slices/driverAuthSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DriverDashboard from "./DriverDashboard";

function DriverHome() {
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
    <div className="">
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
          <a href="#" className="hover:text-gray-300">
            Dashboard
          </a>
          <a href="#" className="hover:text-gray-300">
            Ride
          </a>
          <a
            href="#"
            onClick={() => navigate("/driver/login")}
            className="hover:text-gray-300"
          >
            Profile
          </a>
          <a href="#" className="hover:text-gray-300">
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
                        navigate("/login");
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
                onClick={() => navigate("/login")}
                className="text-white w-20  h-8"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="Signup bg-white rounded text-black w-20  h-8"
              >
                Signup
              </button>
            </>
          )}
        </div>
      </nav>

      {/* banner side  */}
      {/* <div className="flex h-screen">
        <div className="w-1/2 bg-black  text-white p-6">
          <div className="mt-40 ml-56">
            <h4 className="text-2xl font-bold mb-4">
              Ready To Assist Anywhere With Go & Go
            </h4>
            <p>Tap, Book, Ride, Go, Enjoy!</p>
          </div>
          <div className="relative  items-center  w-1/2 ml-52 mt-10  ">
            <input
              type="text"
              placeholder="Pickup Location"
              className="border-2 border-gray-300 rounded-full px-4 py-2 w-full"
            />
            <div className="icon-line">
              <GpsFixedIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black " />
            </div>
          </div>
          <div className="relative  items-center  w-1/2 ml-52 mt-10">
            <input
              type="text"
              placeholder="Dropoff Location"
              className="border-2 border-gray-300 rounded-full px-4 py-2 w-full"
            />
            <GpsFixedIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black" />
          </div>
          <style>{`
           .icon-line::before {
              content: '';
              position: absolute;
              top: 50%;
              left: 91.5%;
              width: 2px;
              height: 200%;
              background-color: white;
              border-style: dotted;
            }
          `}</style>
          <button
            onClick={() => dispatch(driverLogout())}
            className="bg-yellow-400 h-9 w-[19%] ml-[54%] mt-9 rounded text-black "
          >
            See Prices
          </button>
        </div>
        <div className="w-1/2 bg-black text-white p-6">
          <img
            src="/images/IMG_2666.jpg"
            alt="Right Side Image"
            className="w-[53%] h-auto ml-40 mt-20"
          />
        </div>
      </div> */}
      <DriverDashboard/>
      <Footer />
    </div>
  );
}

export default DriverHome;
