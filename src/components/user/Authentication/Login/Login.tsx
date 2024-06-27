/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axiosUser from "../../../../service/axios/axiosUser";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ConfirmationResult,
  RecaptchaVerifier,
} from "firebase/auth";

import { jwtDecode } from "jwt-decode";


import { auth } from "../../../../service/firebase";

import { PinInput, PinInputField, HStack } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { userLogin } from "../../../../service/redux/slices/userAuthSlice";

import {  CredentialResponse, GoogleLogin } from "@react-oauth/google";
import {  sendOtp } from "../../../../Hooks/auth";

interface UserData {
  user: string;
  user_id: string;
  userToken:string;
  refreshToken:string;
  loggedIn: boolean;
}

function Login() {
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
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
      mobile: "",
    },
    validationSchema: yup.object({
      mobile: yup
        .string()
        .length(10, "Enter a valid mobile number")
        .required("please enter the mobile number"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axiosUser().post("/checkLoginUser", values);        
        if (data.message === "Success") {
          sendOtp(setotpInput,auth,formik.values.mobile,setConfirmationResult);
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
        toast.error((error as Error).message);
      }
    },
  });

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

  
  const otpVerify = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (otp && confirmationResult) {
      const otpValue: string = otp.toString();
      confirmationResult
        .confirm(otpValue)
        .then(async () => {
          console.log(userData,"-------")
          localStorage.setItem("userToken",userData.userToken)
          localStorage.setItem("refreshToken",userData.refreshToken)
          dispatch(userLogin(userData))
          toast.success("login success");
          navigate("/");
        })
        .catch(() => {
          toast.error("Enter a valid otp");
        });
    } else {
      toast.error("Enter a valid otp");
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
              {otpInput?(<img
              className="mt-2"
                style={{ height: "330px", width: "auto" }}
                src="/images/otp.jpg"
                alt=""
              />):(
                <img
              className="mt-2"
                style={{ height: "330px", width: "auto" }}
                src="/images/login.jpg"
                alt=""
              />
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
                  <SmartphoneIcon className={iconsColor} />
                  <input
                    className="pl-2 outline-none border-b w-full"
                    type="number"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="mobile"
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
                      onClick={otpVerify}
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
                          onClick={() => {
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


