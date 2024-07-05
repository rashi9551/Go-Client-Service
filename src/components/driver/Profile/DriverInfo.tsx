import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosDriver from "../../../service/axios/axiosDriver";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Switch } from "@material-tailwind/react";
import { Spinner } from "@chakra-ui/react";
import { DriverInterface } from "../../../utils/interfaces";
import  { driverLogin } from "../../../service/redux/slices/driverAuthSlice";

const DriverInfo = () => {
  const { driverId } = useSelector((store: {driver:{driverId:string}}) => store.driver);
  const [driverData, setdriverData] = useState<DriverInterface | null >(null);
  const dispatch=useDispatch()
  const getData = async () => {
    try {
      const { data } = await axiosDriver().get(
        `driverData?driver_id=${driverId}`
      );
      setdriverData(data);
    } catch (error) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const [editProfile, seteditProfile] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3, "Type a valid name"),
      email: Yup.string().email("Please enter a valid email"),
      mobile: Yup.string().length(10, "Please enter a valid number"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await axiosDriver().post(
          `profileUpdate?driver_id=${driverId}`,
          values
        );
        if (data.message === "Success") {
          const driver=data.driverData
          dispatch(driverLogin(driver))
          setdriverData(driver);
          seteditProfile(false);
          toast.success("Profile updated successfully");
        }
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const updateStatus = async () => {
    try {
      const { data } = await axiosDriver().get(
        `updateStatus?driver_id=${driverId}`
      );
      console.log(data,"updated"); 
      if (data._id) {
        setdriverData(data);
        toast.success("Status updated successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      <div className="bg-gray-100 w-[96%] mx-auto h-fit rounded-2xl drop-shadow-2xl md:flex items-center px-5">
        {!driverData && (
          <div className="pr-4 mx-5 w-full text-center">
            <Spinner size="lg" />
          </div>
        )}

        <div className="md:w-1/3 md:h-96 h-80">
          <div className="h-full flex flex-col gap-1 justify-center items-center">
            <div className="avatar">
              <div className="w-36 rounded-full drop-shadow-xl">
                <img src={driverData?.driverImage} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold">{driverData?.name}</h1>
            </div>
            <div className="flex gap-1">
              <h1 className="text-sm">Go Rating :</h1>
              <h1 className="text-sm"> {driverData?.totalRatings} ratings</h1>
            </div>
            <div className="flex gap-3 mt-2">
              <h1 className="font-medium text-lg">Currently Available </h1>
              <Switch
                checked={driverData?.isAvailable}
                onChange={updateStatus}
                id="custom-switch-component"
                ripple={false}
                className="h-full w-full checked:bg-[#2ec946]"
                containerProps={{
                  className: "w-11 h-6",
                }}
                circleProps={{
                  className: "before:hidden left-0.5 border-none",
                }}
                crossOrigin={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            </div>
          </div>
        </div>
        <div className="md:w-2/3 h-full py-8 pr-7">
          {!editProfile ? (
            <div className="flex flex-col w-full h-full gap-4">
              <div className="w-full flex gap-6 -mb-3">
                <p className="w-1/2">Name</p>
                <p className="w-1/2 hidden md:block">Mobile</p>
              </div>
              <div className="md:flex gap-6">
                <Input
                  label={driverData?.name}
                  disabled
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <p className="w-1/2 md:hidden">Mobile</p>
                <Input
                  label={
                    driverData && driverData.mobile
                      ? driverData.mobile.toString()
                      : ""
                  }
                  disabled
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              </div>
              <div className="w-full flex gap-6 -mb-3">
                <p className="w-1/2">Email</p>
                <p className="w-1/2 hidden md:block">Referral Code</p>
              </div>
              <div className="md:flex gap-6">
                <Input
                  label={driverData?.email}
                  disabled
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <p className="w-1/2 md:hidden">Refferl Code</p>
                <Input
                  label={driverData?.referral_code}
                  disabled
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              </div>
              <div className="w-full flex gap-6 -mb-3">
                <p className="w-1/2">Account Status</p>
                <p className="w-1/2 hidden md:block">Joining Date</p>
              </div>
              <div className="md:flex gap-6">
                <Input
                  label={driverData?.account_status}
                  disabled
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <p className="w-1/2 md:hidden">Joining Date</p>
                <Input
                  label={driverData?.formattedDate}
                  disabled
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              </div>
              <div className="">
                <button
                  onClick={() => seteditProfile(true)}
                  className="btn btn-sm  bg-blue-400  text-white font-semibold hover:bg-blue-600 relative right-2 rounded-full px-4 py-2 transition-colors duration-300"
                >
                  EDIT PROFILE
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col w-full h-full gap-4"
            >
              <div className="w-full flex gap-6 -mb-3">
                <p className="w-1/2">Name</p>
                <p className="w-1/2 hidden md:block">Mobile</p>
              </div>
              <div className="md:flex gap-6">
                <input
                  name="name"
                  onChange={formik.handleChange}
                  type="text"
                  placeholder={driverData?.name}
                  className="input input-bordered input-sm py-[1.16rem] w-full max-w-xs"
                />
                <p className="w-1/2 md:hidden">Mobile</p>
                <input
                  name="mobile"
                  onChange={formik.handleChange}
                  type="number"
                  placeholder={driverData?.mobile}
                  className="input input-bordered input-sm py-[1.16rem] w-full max-w-xs"
                />
              </div>
              <div className="w-full flex gap-6 -mb-3">
                <p className="w-1/2">Email</p>
                <p className="w-1/2 hidden md:block">Referral Code</p>
              </div>
              <div className="md:flex gap-6">
                <input
                  name="email"
                  onChange={formik.handleChange}
                  type="text"
                  placeholder={driverData?.email}
                  className="input input-bordered input-sm py-[1.16rem] w-full max-w-xs"
                />
                <p className="w-1/2 md:hidden">Refferl Code</p>
                <Input
                  label={driverData?.referral_code}
                  disabled
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              </div>
              <div className="w-full flex gap-6 -mb-3">
                <p className="w-1/2">Account Status</p>
                <p className="w-1/2 hidden md:block">Joining Date</p>
              </div>
              <div className="md:flex gap-6">
                <Input
                  label={driverData?.account_status}
                  disabled
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <p className="w-1/2 md:hidden">Joining Date</p>
                <Input
                  label={driverData?.formattedDate}
                  disabled
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              </div>
              <div className='flex gap-3'>
                                <button
                                    type='submit'
                                    className='w-[20%] h-10 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300'>  SAVE CHANGES  </button>
                                <button
                                    onClick={() => seteditProfile(false)}
                                    className='btn btn-xs bg-red-400 text-white hover:bg-red-600 relative right-2 rounded-full px-4 py-2 transition-colors duration-300'>CANCEL</button>
                            </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default DriverInfo;
