declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}
import "./Sigunp.scss";
import { useFormik } from "formik";
import axiosUser from "../../../../service/axios/axiosUser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  Auth,
  ConfirmationResult,
} from "firebase/auth";

import { PinInput, PinInputField, HStack } from "@chakra-ui/react";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import PersonIcon from "@mui/icons-material/Person";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import GroupIcon from "@mui/icons-material/Group";

import { signupValidation } from "../../../../utils/validation";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { auth } from "../../../../service/firebase";

function Signup() {
  const [counter, setCounter] = useState(30);
  const [otpPage, setOtpPage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (otpPage) {
      counter > 0 &&
        setTimeout(() => {
          setCounter(counter - 1);
        }, 1000);
    }
  }, [counter, otpPage]);

  const [otp, setOtp] = useState<number>(0);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  useEffect(() => {
      setOtpPage(false);
  }, []);
  const initialValues = {
    name: "",
    email: "",
    mobile: "",
    password: "",
    re_password: "",
    reffered_code: "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: signupValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("sub");
        await signipHandle(values);
      } catch (error) {
        setSubmitting(false);
      }
    },
  });

  const signupSubmit = async () => {
    try {
      const response = await axiosUser("").post("/register", formik.values);
      console.log(response)
      if (response.data.message === "Success") {
        toast.success("OTP verified succesfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const signipHandle = async (formData: unknown) => {
    try {
      const { data } = await axiosUser("").post("/checkUser", formData);
      if (data.message === "user already have an account !") {
        console.log(data);
        toast.info("user Already registered Please Login to continue");
        navigate("/login");
      } else {
        sendOtp();
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const onCaptchaVerify = (auth: Auth) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            toast.success("Otp sent successfully");
          },
          "expired-callback": () => {
            toast.error("TimeOut");
          },
        }
      );
    }
  };

  const sendOtp = async () => {
    try {
      onCaptchaVerify(auth);
      const number = "+91" + formik.values.mobile;
      const appVerifier = window.recaptchaVerifier;
      if (appVerifier) {
        const result = await signInWithPhoneNumber(auth, number, appVerifier);
        console.log(result, "-----");
        setConfirmationResult(result);
        setOtpPage(true);
      } else {
        throw new Error("Recaptcha verifier is not available.");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const otpVerify = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    console.log("jdghshdg")
    if (otp && confirmationResult) {
        console.log("==========")
      const otpValue: string = otp.toString();
      console.log(otpValue,"otp")
      confirmationResult
        .confirm(otpValue)
        .then(async () => {
          signupSubmit();
        })
        .catch(() => {
            console.log("catch")
            toast.error("Enter a valid otp");
        });
    } else {
        console.log("if")
      toast.error("Enter a valid otp");
    }
  };

  const handleOtpChange = (index: number, newValue: number) => {
    const newOtp = [...otp.toString()];
    newOtp[index] = newValue.toString();
    setOtp(parseInt(newOtp.join("")));
  };

  const iconsColor = "text-gray-400";
  const with_error_class = "pl-2 outline-none border-b border-red-400 w-full";
  const without_error_class = "pl-2 outline-none border-b w-full";
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
      <div className="registration-container h-screen flex justify-center items-center">
        <div className="registration-container-second md:w-4/6 w-5/6 md:h-4/5 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
          <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 i justify-around items-center mb-3 md:m-0">
            <div className="flex w-full justify-center pt-10 items-center">
              <h1 className="text-blue-800 font-bold text-4xl mx-7 md:mx-0 md:text-6xl user-signup-title md:mb-4 ">
                Signup and get a free first ride!
              </h1>
            </div>
            <div className="hidden md:flex md:items-center justify-center">
              <img
                style={{ height: "280px", width: "auto" }}
                src="https://d2y3cuhvusjnoc.cloudfront.net/11668479_20943593.jpg"
                alt=""
              />
            </div>
          </div>
          {otpPage ? (
            <div className="flex md:w-1/2 justify-center px-4  pb-10 md:py-10 items-center">
              <div className="user-otp-form md:w-10/12 px-9 py-10  bg-white drop-shadow-2xl">
                <form>
                  <div className="flex justify-center items-center mb-5">
                    <h1 className="text-gray-800 font-bold text-xl text-center">
                      Enter the OTP sent to your mobile
                    </h1>
                  </div>

                  <HStack className="ml-8" >
                    <PinInput size='sm'  otp placeholder="">
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

                  <button
                    onClick={otpVerify}
                    type="submit"
                    className="block w-full text-white bg-blue-800 py-2 my-4 rounded-2xl text-golden font-semibold mb-2"
                  >
                    Verify
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
                          sendOtp();
                        }}
                      >
                        Resend OTP
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex md:w-1/2 justify-center pb-10 md:py-10 items-center">
              <div className="user-signup-form md:w-8/12 px-9 py-8 bg-white drop-shadow-xl">
                <form onSubmit={formik.handleSubmit}>
                  <div className="flex items-center  py-2 px-3 rounded-2xl mb-2">
                    <PersonIcon className={iconsColor} />
                    <input
                      className={
                        formik.touched.name && formik.errors.name
                          ? with_error_class
                          : without_error_class
                      }
                      type="text"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="name"
                      placeholder="Full Name"
                    />
                  </div>
                  {formik.touched.name && formik.errors.name && (
                    <p className="form-error-p-tag">{formik.errors.name}</p>
                  )}
                  <div className="flex items-center  py-2 px-3 rounded-2xl mb-2">
                    <AlternateEmailIcon className={iconsColor} />
                    <input
                      className={
                        formik.touched.email && formik.errors.email
                          ? with_error_class
                          : without_error_class
                      }
                      type="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Email Address"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="form-error-p-tag">{formik.errors.email}</p>
                  )}
                  <div className="flex items-center  py-2 px-3 rounded-2xl mb-2">
                    <SmartphoneIcon className={iconsColor} />
                    <input
                      className={
                        formik.touched.mobile && formik.errors.mobile
                          ? with_error_class
                          : without_error_class
                      }
                      type="text"
                      value={formik.values.mobile}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="mobile"
                      placeholder="Mobile Number"
                    />
                  </div>
                  {formik.touched.mobile && formik.errors.mobile && (
                    <p className="form-error-p-tag">{formik.errors.mobile}</p>
                  )}
                  <div className="flex items-center  py-2 px-3 rounded-2xl mb-2">
                    <VpnKeyIcon className={iconsColor} />
                    <input
                      className={
                        formik.touched.password && formik.errors.password
                          ? with_error_class
                          : without_error_class
                      }
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="password"
                      placeholder="pasword"
                    />
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="form-error-p-tag">{formik.errors.password}</p>
                  )}
                  <div className="flex items-center  py-2 px-3 rounded-2xl mb-2">
                    <VpnKeyIcon className={iconsColor} />
                    <input
                      className={
                        formik.touched.re_password && formik.errors.re_password
                          ? with_error_class
                          : without_error_class
                      }
                      type="password"
                      value={formik.values.re_password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="re_password"
                      placeholder="Confirm Password"
                    />
                  </div>
                  {formik.touched.re_password && formik.errors.re_password && (
                    <p className="form-error-p-tag">
                      {formik.errors.re_password}
                    </p>
                  )}
                  <div className="flex items-center  py-2 px-3 rounded-2xl">
                    <GroupIcon className={iconsColor} />
                    <input
                      className={
                        formik.touched.reffered_code &&
                        formik.errors.reffered_code
                          ? with_error_class
                          : without_error_class
                      }
                      type="text"
                      value={formik.values.reffered_code}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="reffered_code"
                      id=""
                      placeholder="Referral Code"
                    />
                  </div>
                  {formik.touched.reffered_code &&
                    formik.errors.reffered_code && (
                      <p className="form-error-p-tag">
                        {formik.errors.reffered_code}
                      </p>
                    )}
                  <button
                    type="submit"
                    className="block w-full text-white bg-blue-800 py-2 rounded-2xl text-golden font-semibold mt-3 mb-2"
                  >
                    Register Now
                  </button>
                  <div className="text-center">
                    <span onClick={() => navigate('/login')} className="text-sm ml-2 hover:text-blue-500 cursor-pointer">
                      Already a member? Login here
                    </span>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </>
  );
}

export default Signup;
