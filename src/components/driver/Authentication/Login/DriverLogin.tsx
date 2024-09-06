/* eslint-disable @typescript-eslint/no-explicit-any */
import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import { auth } from "../../../../service/firebase";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {toast} from 'sonner' ;
import * as yup from "yup"
import { useNavigate } from "react-router-dom";
import axiosDriver from "../../../../service/axios/axiosDriver";
import { driverLogin } from "../../../../service/redux/slices/driverAuthSlice";

import { jwtDecode } from "jwt-decode";

import {
    ConfirmationResult,
  } from "firebase/auth";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {  openPendingModal } from "../../../../service/redux/slices/pendingModalSlice";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { openRejectedModal } from "../../../../service/redux/slices/rejectModalSlice";
import { sendOtp } from "../../../../Hooks/auth";
import './DriverLogin.scss'
import { Player } from "@lottiefiles/react-lottie-player";
  
function DriverLogin() {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const [otpInput,setotpInput]=useState<boolean>(false)
    const [otp,setOtp]=useState<number>(0);
    const [driverData,setdriverData]=useState({
        name:"",
        driverToken:"",
        driver_id:"",
        refreshToken:""
    })
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    const [counter,setCounter]=useState<number>(40)
    useEffect(() => {
        if (otpInput) {
            counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
        }
    }, [counter, otpInput]);

    const formik=useFormik({
        initialValues:{
            mobile:""
        },
        validationSchema:yup.object({
            mobile:yup.string().length(10,"Enter a valid mobile number").required("Please enter the mobile number")
        }),
        onSubmit:async (values)=>{
            try {
                const {data}=await axiosDriver().post("/checkLoginDriver",values)
                console.log(data);
                
                if(data.message==="Success"){
                    sendOtp(setotpInput,auth,formik.values.mobile,setConfirmationResult);
                    setdriverData({name:data.name,refreshToken:data.refreshToken,driverToken: data.token, driver_id: data._id })
                }else if (data.message === "Incomplete registration") {
                    toast.info("Please complete the verification!");
                    localStorage.setItem("driverId", data.driverId);
                    navigate('/driver/signup')
                } else if (data.message === "Blocked") {
                    toast.info("Your account is blocked!");
                } else if (data.message === "Not verified") {
                    dispatch(openPendingModal());
                } else if (data.message === "Rejected") {
                    localStorage.setItem("driverId", data.driverId);
                    dispatch(openRejectedModal());
                } else {
                    toast.error("Not registered! Please register to  continue.");
                }
                
            } catch (error) {
                toast.error((error as Error).message);
            }
        }
    })
    
   

    const otpVerify = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        event.preventDefault();
        if (otp && confirmationResult) {
          const otpValue: string = otp.toString();
          confirmationResult
            .confirm(otpValue)
                .then(async () => {
                    toast.success("Login success");
                    localStorage.setItem("driverToken",driverData.driverToken)
                    localStorage.setItem("DriverRefreshToken",driverData.refreshToken)
                    dispatch(driverLogin(driverData));
                    navigate("/driver/dashboard");
                    localStorage.removeItem("driverId");
                })
                .catch(() => {
                    toast.error("Enter a valid otp");
                });
        } else {
            toast.error("Enter a valid otp");
        }
    };

    const handleOtpChange=(index:number,newValue:number)=>{
        const newOtp=[...otp.toString()];
        newOtp[index]=newValue.toString();
        setOtp(parseInt(newOtp.join("")))
    }

    const googleLogin = async (datas: CredentialResponse) => {
        try {
                const token:string |undefined=datas.credential
            if (token) {
                const decode = jwtDecode(token) as any
                const response = await axiosDriver().post("checkGoogleLoginDriver", {email:decode.email});
                console.log(decode.email,"ithu email");
                if (response.data.message === "Success") {
                    toast.success("Login success!");
                    localStorage.setItem("driverToken",response.data.token)
                    localStorage.setItem("DriverRefreshToken",response.data.refreshToken)
                    dispatch(
                        driverLogin({
                            name: response.data.name,
                            driver_id: response.data._id,
                        })
                    );
                    localStorage.removeItem("driverId");
                    navigate("/driver/dashboard");
                } else if (response.data.message === "Incomplete registration") {
                    toast.info("Please complete the registration!");
                    localStorage.setItem("driverId", response.data.driverId);
                    navigate('/driver/signup')
                } else if (response.data.message === "Blocked") {
                    toast.info("Your account is blocked!");
                } else if (response.data.message === "Not verified") {
                    dispatch(openPendingModal());
                } else if (response.data.message === "Rejected") {
                    dispatch(openRejectedModal());
                    localStorage.setItem("driverId", response.data.driverId);
                } else {
                    toast.error("Not registered! Please register to  continue.");
                }
            }
        } catch (error: any) {
            toast.error(error);
        }
    };

    const iconsColor = "text-gray-400";


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
  const {data} =await axiosDriver().post('/testerLogin',{password,email})
  console.log(data,"hchjjkb");
  
    if (data.message === "Success") {
        toast.success("Login success!");
        localStorage.setItem("driverToken",data.token)
        localStorage.setItem("DriverRefreshToken",data.refreshToken)
        dispatch(
            driverLogin({
                name: data.name,
                driver_id:data._id,
            })
        );
        localStorage.removeItem("driverId");
        navigate("/driver/dashboard");
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

  return (
    <>
     <nav className="bg-black text-white flex justify-between items-center p-6 ">
        <div className="flex items-center space-x-4">
          <Link to="/driver/login" className="hover:text-gray-300">
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




            <div className="driver-registration-container h-screen flex justify-center items-center">
                <div className="w-5/6 md:w-4/6 md:h-4/5  md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
                    <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 i justify-around items-center mb-3 md:m-0">
                        <div className=" w-full pt-10 ">
                            <h1 className="text-blue-900 font-bold md:mt-4 text-4xl mx-7 md:mx-0  md:text-5xl user-signup-title md:max-w-sm">
                                Please sign in with your mobile number! 
                            </h1>
                            <h1 className="text-blue-800 md:max-w-xs text-sm my-3 mx-7 md:mx-0  md:text-sm md:mt-3 user-signup-title">
                                We'll send you a One-Time-Password to your registered mobile number.
                            </h1>
                        </div>

                        <div className="hidden   md:flex md:items-center">
                        {otpInput?(
                         <div className="mt-6">
                        <Player
                        autoplay
                        loop
                        src="https://lottie.host/363e0788-7405-4a23-8e9b-f319bf535d6b/NtF1LZyBk6.json"
                        style={{ height: '80%', width: '80%',background:"transparent" }}
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
                    <div className="flex md:w-1/2 justify-center  pb-10 md:py-10 items-center">
                        <div className="user-signup-form md:w-8/12 px-9 py-8  bg-white drop-shadow-xl">
                            <form onSubmit={formik.handleSubmit}>
                                <div className="text-center">
                                    <h1 className="text-gray-800 font-bold text-2xl mb-5">Welcome back!</h1>
                                </div>

                                <div className="flex items-center  py-2 px-3 rounded-2xl mb-2">
                                    <SmartphoneIcon className={iconsColor} />

                                    <input
                                        className="pl-2 outline-none border-b w-full"
                                        type="number"
                                        name="mobile"
                                        value={formik.values.mobile}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        id="mobile"
                                        placeholder="Mobile number"
                                    />
                                </div>
                                {formik.touched.mobile && formik.errors.mobile && (
                                    <p className="form-error-p-tag">{formik.errors.mobile}</p>
                                )}

                                <div className="my-4 px-2">
                                    {otpInput && (
                                        <HStack>
                                            <PinInput otp placeholder="">
                                                {[...Array(6)].map((_, index) => (
                                                    <PinInputField
                                                        key={index}
                                                        onChange={(e) => handleOtpChange(index, parseInt(e.target.value))}
                                                    />
                                                ))}
                                            </PinInput>
                                        </HStack>
                                    )}
                                </div>

                                {otpInput ? (
                                    <>
                                        <button
                                            onClick={otpVerify}
                                            className="block w-full bg-blue-800 py-1.5 rounded-2xl text-golden font-semibold mb-2"
                                        >
                                            Verify OTP
                                        </button>
                                        <div className="text-center text-gray-500 mt-4">
                                            {counter > 0 ? (
                                                <p className="text-sm">Resend OTP in 00:{counter}</p>
                                            ) : (
                                                <p
                                                    className="text-sm text-blue-800 cursor-pointer"
                                                    onClick={(e) => {e.preventDefault()
                                                        setCounter(40);
                                                        setOtp(0)
                                                        sendOtp(setotpInput,auth,formik.values.mobile,setConfirmationResult);
                                                    }}
                                                >
                                                    Resend OTP
                                                </p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        type="submit"
                                        className="block w-full bg-blue-800 py-1.5 rounded-2xl text-golden font-semibold mb-2"
                                    >
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

                                <div className="text-center">
                                    <span
                                        onClick={() => navigate('/driver/signup')}
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
  )
}

export default DriverLogin

