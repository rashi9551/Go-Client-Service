/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}
import MailIcon from '@mui/icons-material/Mail';
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axiosUser from "../../../../service/axios/axiosUser";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import {ConfirmationResult,RecaptchaVerifier,} from "firebase/auth";
import { jwtDecode } from "jwt-decode";
// import { auth } from "../../../../service/firebase";
import { PinInput, PinInputField, HStack } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { userLogin } from "../../../../service/redux/slices/userAuthSlice";
import {  CredentialResponse, GoogleLogin } from "@react-oauth/google";
// import {  sendOtp } from "../../../../Hooks/auth";
import { Player } from "@lottiefiles/react-lottie-player";
import './Login.scss'
import { RecaptchaVerifier } from 'firebase/auth';
interface UserData {
  user: string;
  user_id: string;
  userToken:string;
  refreshToken:string;
  loggedIn: boolean;
}

function Login() {
  // const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  console.log(import.meta.env.VITE_API_GATEWAY_URL);
  const navigate = useNavigate();
  const [userData, setuserData] = useState<UserData>({
    user: "",
    user_id: "",
    userToken:"",
    refreshToken:"",
    loggedIn:false
  });
  const dispatch=useDispatch()
  const formik = useFormik({
    initialValues: {
      email:"",
    },
    validationSchema: yup.object({
      email: yup.string().email("Please enter a valid email").required("Please enter an email"),
    }),
    onSubmit: async () => {
      try {
        await formikHandleSubmit()
        
      } catch (error) {
        console.log(error);
      }
    },
  });

  const formikHandleSubmit=async()=>{
    try {
      const { data } = await axiosUser().post("/checkLoginUser", formik.values);        
      if (data.message === "Success") {
        // sendOtp(setotpInput,auth,formik.values.mobile,setConfirmationResult);
        toast.success("Otp sent successfully");
        setotpInput(true);
        console.log(data,"-========")
        setuserData({
          user: data.name,
          user_id: data._id,
          userToken:data.token,
          refreshToken:data.refreshToken,
          loggedIn:true
        });          
      } else if (data.message === "Blocked") {
        toast.info("your account is blocked");
      } else {
        toast.error("Not registered! please register to continue.");
      }
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message);
    }
  }
  const [otpInput, setotpInput] = useState(false);
  const [otp, setOtp] = useState<number>(0);

  const handleOtpChange = (index: number, newValue: number) => {
    const newOtp = [...otp.toString()];
    newOtp[index] = newValue.toString();
    setOtp(parseInt(newOtp.join("")));
  };

  const [counter, setCounter] = useState(40);
  useEffect(() => {
    if (otpInput) {
      counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }
  }, [counter, otpInput]);

  
  const otpVerify = async(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    email:string
  ) => {
    event.preventDefault();
    // if (otp && confirmationResult) {
    //   const otpValue: string = otp.toString();
    //   confirmationResult
    //     .confirm(otpValue)
    //     .then(async () => {
    //       console.log(userData,"-------")
    //       localStorage.setItem("userToken",userData.userToken)
    //       localStorage.setItem("refreshToken",userData.refreshToken)
    //       dispatch(userLogin(userData))
    //       toast.success("login success");
    //       navigate("/");
    //     })
    //     .catch(() => {
    //       toast.error("Enter a valid otp");
    //     });
    // } else {
    //   toast.error("Enter a valid otp");
    // }

    try {
      if(counter<1){
        toast.error("Otp Time Expired")
        return
      }
      const {data}=await axiosUser().post('/verifyOtp',{email,otp})
      if(data.message==='Success'){
        console.log(userData,"-------")
        localStorage.setItem("userToken",userData.userToken)
        localStorage.setItem("refreshToken",userData.refreshToken)
        dispatch(userLogin(userData))
        toast.success("login success");
        navigate("/");
      }else{
          toast.error("Enter a valid otp");
      }
      
    } catch (error) {
        console.log(error,"error in verifying otp");
        
    }
  };
  const googleLogin = async (datas: CredentialResponse) => {
    try {
      const token:string |undefined=datas.credential
      if (token) {
        const decode = jwtDecode(token) as any
        const { data } = await axiosUser().post("checkGoogleLoginUser", { email: decode.email });        
        if (data.message === "Success") {
          toast.success("Login success!");
          localStorage.setItem("userToken",data.token)
          localStorage.setItem("refreshToken",data.refreshToken)
                dispatch(userLogin({user: data.name,user_id: data._id,loggedIn:true}));
                navigate("/");
            } else if (data.message === "Blocked") {
                toast.error("Your Blocked By Admin");
            } else {
                toast.error("Not registered! Please register to  continue.");
            }
        }
    } catch (error: any) {
        toast.error(error);
    }
};


const [isOpen, setIsOpen] = useState(true);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [countdown, setCountdown] = useState(80);

const handleTestSubmit=async(e: React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault()
  if(password.length==0||email.length==0){
    toast.error("enter email and password")
    return
  }
  console.log(email,password);
  const {data} =await axiosUser().post('/testerLogin',{password,email})
  console.log(data);
  
    if (data.message === "Success") {
        toast.success("Login success!");
        localStorage.setItem("userToken",data.token)
        localStorage.setItem("refreshToken",data.refreshToken)
        dispatch(userLogin({user: data.name,user_id: data._id,loggedIn:true}));
        navigate("/");

      } else if( data.message==="incorrect password"){

        toast.error("password incorrect")
      } else if (data.message === "Blocked") {

          toast.error("Your Blocked By Admin");
      } else {

          toast.error("Not registered! Please register to  continue.");
      }
  
  
}

useEffect(() => {
  if (countdown > 0) {
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  } else {
    setIsOpen(false);
  }
  
}, [countdown]);

  const iconsColor = "text-gray-400";
  return (
    <>
      {/* nav  */}
      <nav className="bg-black text-white flex justify-between items-center p-6 ">
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gray-300">
            <img
              src="/images/images__1_-removebg-preview.png"
              alt="Logo"
              className=" w-[40%]"
            />
          </Link>
        </div>
      </nav>

      <>
  {isOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative animate-scaleIn">
        <div className="border-orange-400 border-2 rounded-md p-5 mb-4">
          <h2 className="font-bold text-lg">Test Credentials</h2>
          <p><strong>Email: </strong> <span className="bg-gray-100 p-2 rounded">test@gmail.com</span></p>
          <p><strong>Password: </strong> <span className="bg-gray-100 p-2 rounded">Test@123</span></p>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Login to your account.
        </h1>
        <p className="text-sm text-gray-500 mb-2">
          If the user wants to see the OTP via email, they have to sign up manually.
        </p>
        <p className="text-sm text-gray-500 mb-2">
          Enter tester email and password below to login.
        </p>
        <p className="text-sm text-red-500 mb-4">
          This tester modal will close in <strong>{countdown}</strong> seconds.
        </p>
        <button
          onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <form onSubmit={handleTestSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="test@gmail.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="Test@123"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )}
</>




      {/* nav   */}
      <div className="registration-container pb-10 h-screen flex justify-center items-center">
        <div className="w-5/6 md:w-4/6 md:h-4/5 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
          <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 i justify-around items-center mb-3 md:m-0">
            <div className="w-full pt-10">
              <h1 className="text-blue-900 font-bold text-4xl mx-7 md:mx-0 md:text-5xl user-login-title md:max-w-md">
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
              {otpInput?(
                <div className="mt-6">
                <Player
                autoplay
                loop
                src="https://lottie.host/363e0788-7405-4a23-8e9b-f319bf535d6b/NtF1LZyBk6.json"
                style={{ height: '60%', width: '60%',background:"transparent" }}
                
              />
              </div>
              ):(
                <div className="mt-6">
                <Player
                autoplay
                loop
                src="https://lottie.host/bc78ee20-18be-4bb9-8d20-db1e2fa99ee5/xJktXr4YdV.json"
                style={{ height: '80%', width: '80%',background:"transparent" }}
                
              />
              </div>
              )}
              
            </div>
          </div>
          <div className="flex md:w-1/2 justify-center pb-10 md:py-10 items-center">
            <div className="user-signup-form md:w-8/12 px-9 py-8 bg-white drop-shadow-xl">
              <form onSubmit={formik.handleSubmit}>
                <div className="text-center">
                  <h1 className="text-gray-800 font-bold text-2xl mb-5">
                    Welcome back!
                  </h1>
                </div>

                <div className="flex items-center py-2 px-3 rounded-2xl mb-2">
                  <MailIcon className={iconsColor} />
                  <input
                    className="pl-2 outline-none border-b w-full"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="email"
                    placeholder="Enter Your Email"
                  />
                </div>

                {formik.touched.email && formik.errors.email && (
                  <p className="form-error-p-tag">{formik.errors.email}</p>
                )}

                <div className="my-4 px-2">
                  {otpInput && (
                    <HStack>
                      <PinInput otp placeholder="">
                        {[...Array(6)].map((_, index) => (
                          <PinInputField
                            key={index}
                            onChange={(e) =>
                              handleOtpChange(index, parseInt(e.target.value))
                            }
                          />
                        ))}
                      </PinInput>
                    </HStack>
                  )}
                </div>

                {otpInput ? (
                  <>
                    <button
                      onClick={(e)=>otpVerify(e,formik.values.email)}
                      className="block w-full text-white bg-blue-800 py-1.5 rounded-2xl font-semibold mb-2"
                    >
                      Verify OTP
                    </button>

                    <div className="text-center text-gray-500 mt-4">
                      {counter > 0 ? (
                        <p className="text-sm">Resend OTP in 00:{counter}</p>
                      ) : (
                        <p
                          className="text-sm text-blue-800 cursor-pointer"
                          onClick={async() => {
                            setCounter(40);
                            setOtp(0)
                            await formikHandleSubmit()
                            // sendOtp(setotpInput,auth,formik.values.mobile,setConfirmationResult);
                          }}
                        >
                          Resend OTP
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <button type="submit" className="block w-full text-white bg-blue-800 py-1.5 rounded-2xl font-semibold mb-2">
                    Send OTP
                  </button>
                )}

                <div className="flex flex-col w-full mt-8 border-opacity-50">
                    <div className="flex items-center text-xs font-medium">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-2">or sign-in using Google</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <div className="flex justify-center items-center mt-5">
                        <GoogleLogin shape="circle" ux_mode="popup" onSuccess={googleLogin} />
                    </div>
                </div>


                <div className="text-center mt-3">
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-xs ml-2 hover:text-blue-500 cursor-pointer"
                    >
                        Not registered yet? Sign-up here!
                    </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </>
  );
}

export default Login;


