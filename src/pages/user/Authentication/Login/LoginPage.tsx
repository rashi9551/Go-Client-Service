import SmartphoneIcon from "@mui/icons-material/Smartphone";
import { Link } from "react-router-dom";

function LoginPage() {






  const iconsColor="text-gray-400"
  return (
    <>
    {/* nav  */}
    <nav className="bg-black text-white flex justify-between items-center p-6 ">
      <div className="flex items-center space-x-4">
      <Link to="/" className="hover:text-gray-300">
        <img src="/images/images__1_-removebg-preview.png" alt="Logo" className=" w-[40%]" /> 
        </Link>
      </div>
    </nav>

    {/* nav   */}
      <div className="registration-container pb-10 h-screen flex justify-center items-center">
        <div className="w-5/6 md:w-4/6 md:h-4/5 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
          <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 i justify-around items-center mb-3 md:m-0">
            <div className="w-full pt-10">
              <h1 className="text-blue-800 font-bold text-4xl mx-7 md:mx-0 md:text-5xl user-login-title md:max-w-md">
                Please sign in with your mobile number!
              </h1>
              <h1 className="text-blue-800 text-sm my-3 mx-7 md:mx-0 md:text-sm md:max-w-xs md:mt-3 user-signup-title">
                We'll send you a One-Time-Password to your registered mobile
                number.
              </h1>
            </div>

            <div
              className="hidden md:flex md:items-center"
              style={{ marginTop: "-25px" }}
            >
              <img
                style={{ height: "330px", width: "auto" }}
                src="https://d2y3cuhvusjnoc.cloudfront.net/[removal.ai]_ac4bb899-8f0d-469a-b782-3d865a890352-12291223_wavy_tech-28_single-10.png"
                alt=""
              />
            </div>
          </div>
          <div className="flex md:w-1/2 justify-center pb-10 md:py-10 items-center">
            <div className="user-signup-form md:w-8/12 px-9 py-8 bg-white drop-shadow-xl">
              <div className="text-center">
                <h1 className="text-gray-800 font-bold text-2xl mb-5">
                  Welcome back!
                </h1>
              </div>

              <div className="flex items-center py-2 px-3 rounded-2xl mb-2">
                <SmartphoneIcon className={iconsColor} />
                <input
                  className="pl-2 outline-none border-b w-full"
                  type="number"
                  name="mobile"
                  placeholder="Mobile number"
                />
              </div>

              <button className="block w-full text-white bg-blue-800 py-1.5 rounded-2xl text-golden font-semibold mb-2">
                Send OTP
              </button>

              <div className="flex flex-col w-full border-opacity-50">
                <div className="divider text-xs font-medium">or sign-in using Google</div>

                <div className="flex justify-center items-center mb-2">
                    {/* <GoogleLogin shape="circle" ux_mode="popup" onSuccess={googleLogin} /> */}
                </div>
            </div>

              <div className="text-center">
                <Link to={"/signup"}>
                <span className="text-xs ml-2 hover:text-blue-500 cursor-pointer">
                  Not registered yet? Sign-up here!
                </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </>
  );
}

export default LoginPage;
