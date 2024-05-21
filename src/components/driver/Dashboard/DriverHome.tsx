import Footer from "../../../components/user/Home/Footer";
import NavBar from "../../../components/user/Home/NavBar";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import WhySafely from "../../../components/user/Home/WhySafety";
import { useDispatch } from "react-redux";
import { driverLogout } from "../../../service/redux/slices/driverAuthSlice";

function DriverHome() {
  const dispatch=useDispatch()
  return (
    <div className="">
      {/* naavbar */}
      <NavBar />

      {/* banner side  */}
      <div className="flex h-screen">
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
          <button onClick={()=>dispatch(driverLogout())} className="bg-yellow-400 h-9 w-[19%] ml-[54%] mt-9 rounded text-black ">
            See Prices
          </button>
        </div>
        <div className="w-1/2 bg-black text-white p-6">
          <img
            src="/images/IMG_2663.JPG"
            alt="Right Side Image"
            className="w-[53%] h-auto ml-40 mt-20"
          />
        </div>
      </div>
      {/* next banner  */}
      <div className="flex  h-screen">
        <div className="w-1/2 bg-white flex  justify-center items-center  text-white p-6">
          <img
            src="/images/IMG_2666.jpg"
            alt="Right Side Image"
            className="w-[53%] h-auto"
          />
        </div>
        <div className="w-1/2 bg-yellow-400 text-white p-6 mb-9 flex  justify-center items-center">
          <div className="mb-[19%]">
            <h4 className="text-2xl font-bold mb-4">
              Flexibility at your fingertips,freedom awaits.
            </h4>
            <h1>
              Make money on your schedule with deliveries
              <br /> or rides—or both. You can use your own car or
              <br /> choose a rental through Go.
            </h1>
            <div className="flex items-center mt-9 ">
              <button className="bg-black h-9  mt- rounded text-white w-28">
                Get Started
              </button>
              <a className="ml-9 border-b-2 text-black border-black" href="">
                Already have an account? sign in --
                <span className="ml-1">&gt;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <WhySafely/>
      <Footer />
    </div>
  );
}

export default DriverHome;
