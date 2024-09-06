/* eslint-disable @typescript-eslint/no-explicit-any */
import Footer from "./Footer";
import NavBar from "./NavBar";
import WhySafely from "./WhySafety";
import Ride from "./Ride";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import TypingText from "../../../Hooks/TypeText";



function Home() {
  const navigate=useNavigate()
  const handleNavigation=()=>{
    navigate('/driver/login')
  }

  return (
    <div className="">
      {/* NavBar */}
      <NavBar />

      {/* Banner */}

      <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 bg-black text-white p-6">
        <div className="mt-20 md:mt-40 md:ml-56 text-center md:text-left">
          <TypingText text="Ready To Assist Anywhere With Go & Go" speed={100} eraseSpeed={100}  pauseDuration={2000} />
          <p className="text-yellow-600">Tap, Book, Ride, Go, Enjoy!</p>
          <div className="mt-[50px]">
          <Player
        autoplay
        loop
        src="https://lottie.host/b0b9429a-aede-416f-b11a-09376106e9d0/zHCbnzyQ67.json"
        style={{ height: '80%', width: '80%',background:"transparent" }}
        
      />

          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 bg-black text-white p-6">
      <div className="relative rounded-lg w-full md:w-[53%] h-auto mx-auto mt-10 md:mt-20 overflow-hidden">
        <img
          src="/images/IMG_2663.JPG"
          alt="Right Side Image"
          className="w-full h-auto animate-fade-zoom"
        />
        <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-r from-black via-transparent to-black opacity-50"></div>
      </div>

      </div>

    </div>

      {/* Ride Component */}
      <div className="py-12 px-6">
        <Ride />
      </div>

      {/* Next Banner */}

        <div className="flex flex-col md:flex-row min-h-screen">
          <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-6">
          <Player
        autoplay
        loop
        src="https://lottie.host/0a822ba8-9941-4266-965d-4165e4eeb255/RSWO2aAKgC.json"
        style={{ height: '80%', width: '80%',background:"transparent" }}
        
      />
          </div>
          <div className="w-full md:w-1/2 bg-yellow-400 text-white p-6 mb-9 flex justify-center items-center">
            <div className="text-center md:text-left mb-10 md:mb-[19%]">
              <h4 className="text-2xl font-bold mb-4">
                Flexibility at your fingertips, freedom awaits.
              </h4>
              <h1>
                Make money on your schedule with deliveries
                <br /> or rides—or both. You can use your own car or
                <br /> choose a rental through Go.
              </h1>
              <div className="flex flex-col items-center mt-9 space-y-3">
      <button
        className="bg-black h-9 rounded text-white w-28"
        onClick={handleNavigation}
      >
        Get Started
      </button>
      
      <div
        className="border-b-2 text-black border-black cursor-pointer"
        onClick={handleNavigation}
      >
        Already have an account? Sign in -- 
        <span className="ml-1">&gt;</span>
      </div>
    </div>
            </div>
          </div>
        </div>

      {/* WhySafely */}
      <WhySafely />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
