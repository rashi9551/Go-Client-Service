/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axiosRide from "../../../service/axios/axiosRide";
import { DriverInterface, RideDetails } from "../../../utils/interfaces";
import { closeUserRideData } from "../../../service/redux/slices/userRideDataSlice";
import { useDispatch } from "react-redux";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@material-tailwind/react";
import { Chip } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Spinner } from "@chakra-ui/react";
import axiosDriver from "../../../service/axios/axiosDriver";
import StarRating from "../../StarRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faTimes } from "@fortawesome/free-solid-svg-icons";

const UserRideDetails = ({ ride_id }: { ride_id: string }) => {
  const [rideData, setrideData] = useState<RideDetails | null>(null);
  const [driverData, setdriverData] = useState<DriverInterface | null>(null);
  const [rating, setRating] = useState(0);
  const userToken = localStorage.getItem("userToken");
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      const response = await axiosRide(userToken).get(
        `getCurrentRide?rideId=${ride_id}`
      );
      const { data } = await axiosDriver().get(
        `driverData?driver_id=${response.data.driver_id}`
      );
      console.log(response.data, "ithu ride");
      setrideData(response.data);
      setdriverData(data);
    } catch (error) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const formik = useFormik({
    initialValues: {
      rating: 0,
      feedback: "",
    },
    validationSchema: Yup.object({
      rating: Yup.number().required("Please provide a rating"),
      feedback: Yup.string().required("Please provide a feedback"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        values.rating = rating;
        const { data } = await axiosDriver().post(
          `feedback?ride_id=${rideData?.ride_id}&_id=${rideData?._id}&driver_id=${rideData?.driver_id}`,
          values
        );
        if (data.message === "Success") {
          toast.success("Feedback submitted successfully");
          dispatch(closeUserRideData());
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error((error as Error).message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  const reasons = [
    "Dangerous driving",
    "Unprofessional behavior",
    "Late arrival",
    "Other",
  ];

  const handleReport = async (reason: string) => {
    setShowDropdown(!showDropdown);
    setSelectedReason(reason);
  };
  const handleSubmitReport=async(e:any)=>{
    e.preventDefault()
    const { data } = await axiosDriver().post(
        `report?ride_id=${rideData?.ride_id}&_id=${rideData?._id}&driver_id=${rideData?.driver_id}`,
        { reason: selectedReason }
      );
      if(data.message === "Success"){
          toast.success("report submitted successfully");
          dispatch(closeUserRideData());
      }
  }

  if (!rideData || !driverData) {
    return (
      <>
        <div className="pr-4 mx-5 w-full text-center">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  const feedbackClass = rideData?.feedback ? "h-2/6 md:h-fit" : "h-2/6";

  return (
    <>
      <div className="pr-4 mx-5">
        <div className="flex w-fit border text-white bg-black px-3 py-1 rounded-xl hover:border-black hover:bg-transparent hover:text-black hover:drop-shadow-xl cursor-pointer transition-colors ease-in-out duration-500 items-center gap-1">
          <ArrowLeftIcon strokeWidth={2} className="h-3 w-4" />
          <h1 onClick={() => dispatch(closeUserRideData())}>Back</h1>
        </div>
        <div className="w-full md:flex h-fit bg-white mt-5 pb-3 rounded-2xl">
          <div className="h-full md:w-2/3 w-full py-3 px-7">
            <div className="h-4/6 md:h-56">
              <h1 className="font-semibold mt-2">Ride Information</h1>
              <div className="md:flex grid grid-rows-3 gap-3 md:gap-0 justify-between px-7 mt-6">
                <div
                  className="tooltip text-left"
                  data-tip={rideData?.pickupLocation}
                >
                  <h1 className="text-sm font-extrabold">PICKUP</h1>
                  <h1 className="text-gray-600 text-sm truncate max-w-[12rem]">
                    {rideData?.pickupLocation}
                  </h1>
                </div>
                <div
                  className="tooltip text-left"
                  data-tip={rideData?.dropoffLocation}
                >
                  <h1 className="text-sm font-extrabold">DROPOFF</h1>
                  <h1 className="text-gray-600 text-sm truncate max-w-[12rem]">
                    {rideData?.dropoffLocation}
                  </h1>
                </div>
                <div>
                  <h1 className="text-sm font-extrabold">DATE</h1>
                  <h1 className="text-gray-600 text-sm">{rideData?.date}</h1>
                </div>
              </div>
              <div className="md:flex grid grid-rows-3 gap-3 md:gap-0 justify-between px-7 mt-2 md:mt-10 border-b-2 pb-9">
                <div>
                  <h1 className="text-sm font-extrabold">DISTANCE</h1>
                  <h1 className="text-gray-600 text-sm">
                    {rideData?.distance}
                  </h1>
                </div>
                <div>
                  <h1 className="text-sm font-extrabold">DURATION</h1>
                  <h1 className="text-gray-600 text-sm">
                    {rideData?.duration}
                  </h1>
                </div>
                <div>
                  <h1 className="text-sm font-extrabold">AMOUNT</h1>
                  <h1 className="text-gray-600 text-sm">₹{rideData?.price}</h1>
                </div>
                {rideData?.status === "Completed" && (
                  <div>
                    <h1 className="text-sm font-extrabold">PAYMENT METHOD</h1>
                    <h1 className="text-gray-600 text-sm">
                      {rideData?.paymentMode}
                    </h1>
                  </div>
                )}
                <div>
                  <h1 className="text-sm font-extrabold">STATUS</h1>
                  <Chip
                    size="sm"
                    variant="ghost"
                    value={rideData?.status}
                    color={
                      rideData?.status === "Completed"
                        ? "green"
                        : rideData?.status === "Pending"
                        ? "cyan"
                        : rideData?.status === "Confirmed"
                        ? "purple"
                        : rideData?.status === "Cancelled"
                        ? "red"
                        : "yellow"
                    }
                  />
                </div>
              </div>
            </div>
            <div className={feedbackClass}>
              <div className="flex justify-between ">
                <h1 className="font-semibold mt-3">Feedback</h1>
                {rideData?.reportReason ? (
                  <div className="text-red-600 font-bold flex items-center">{rideData.reportReason}</div>
                ) : (
                  rideData?.status === "Completed" && !rideData?.feedback &&(
                    <div className="relative h-42">
                      <button
                        className="text-red-600 font-bold hover:underline flex items-center"
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        {selectedReason.length > 0 && (
                          <button
                            className="absolute right-0 top-0 mt-5 mr-1 text-gray-600 hover:text-red-600 focus:outline-none"
                            onClick={() => {
                              setSelectedReason("");
                              setShowDropdown(!showDropdown);
                            }}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        )}

                        {selectedReason.length > 0 ? (
                          <>{selectedReason} Report</>
                        ) : (
                          <>
                            Report{" "}
                            <FontAwesomeIcon icon={faFlag} className="ml-1" />
                          </>
                        )}
                      </button>

                      {showDropdown && (
                        <div className="absolute bg-white shadow-lg rounded-lg mt-2 py-1 w-40 z-10">
                          {reasons.map((reason, index) => (
                            <button
                              key={index}
                              onClick={() => handleReport(reason)}
                              className="block text-left px-4 py-2 text-gray-800 hover:bg-gray-200 w-full"
                            >
                              {reason}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
              {rideData?.status === "Completed" ? (
                <>
                  {rideData?.feedback ? (
                    <>
                      <div className=" w-full h-full flex flex-col gap-3 px-5 pt-2">
                        <h1>"{rideData?.feedback}"</h1>
                        <div className="rating gap-1 w-3/4">
                          <StarRating
                            totalStars={5}
                            initialRating={rideData.rating}
                            onStarClick={() => {}}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <form
                      onSubmit={formik.handleSubmit}
                      className="flex flex-col gap-3 md:px-5 pt-2"
                    >
                      <div className="md:flex gap-6 items-center">
                        <textarea
                          onChange={formik.handleChange}
                          placeholder="Please provide a feedback"
                          className="rounded-lg outline-none px-2 max-w-[14.5rem] md:max-w-full pt-1 border border-blue-gray-50 drop-shadow-xl"
                          name="feedback"
                          id=""
                          rows={3}
                          cols={65}
                        ></textarea>
                        <div className="">
                          <h1 className="text-sm">Choose the rating</h1>
                          <div className="rating mt-1 gap-1 w-full">
                            <StarRating
                              totalStars={5}
                              initialRating={formik.values.rating}
                              onStarClick={setRating}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-1">
                        <button
                          type="submit"
                          className="w-[30%] h-10 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300"
                        >
                          submit feedback
                        </button>
                        {selectedReason.length > 0 && (
                          <button
                            type="submit"
                            className="w-[30%] ml-2 h-10 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-300"
                            onClick={(e)=>handleSubmitReport(e)}
                          >
                            submit Report
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </>
              ) : (
                <>
                  <div className="mt-2">
                    <h1>
                      Feedbacks can only be provided to the completed rides!
                    </h1>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="p-3 h-full md:w-1/3 w-full">
            <div className="py-3 px-5 bg-white w-full rounded-xl drop-shadow-xl h-full">
              <div>
                <h1 className="font-bold">Driver Information</h1>
              </div>
              <div className="text-center mt-4">
                <Avatar
                  src={driverData?.driverImage}
                  alt="avatar"
                  size="xxl"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              </div>
              <div className="flex flex-col items-center mt-2 gap-1">
                <div className="flex gap-3">
                  <h1 className="font-semibold">Name:</h1>
                  <h1 className="text-gray-600">{driverData?.name}</h1>
                </div>
                <div className="flex gap-3">
                  <h1 className="font-semibold">Cab Model:</h1>
                  <h1 className="text-gray-600">
                    {driverData?.vehicle_details?.model}
                  </h1>
                </div>
                <div className="md:flex gap-3">
                  <h1 className="font-semibold">Cab Registration ID:</h1>
                  <h1 className="text-gray-600 text-center">
                    {driverData?.vehicle_details?.registerationID}
                  </h1>
                </div>
              </div>
              <div className="h-20 py-3">
                <div className="w-full h-full flex gap-2 justify-center items-center border border-blue-gray-400 rounded-2xl ">
                  <h1 className="font-bold ">Go RATING :</h1>
                  <h1>{driverData?.totalRatings} Ratings</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRideDetails;
