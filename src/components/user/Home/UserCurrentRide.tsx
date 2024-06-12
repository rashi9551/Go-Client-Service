/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosUser from "../../../service/axios/axiosUser";
import { toast } from "react-toastify";
import { reverseGeocodeForLocality } from "../../../Hooks/Map";
import {
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import socketIOClient, { Socket } from "socket.io-client";
import { DriverInterface, RideDetails, UserInterface } from "../../../utils/interfaces";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@material-tailwind/react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import axiosRide from "../../../service/axios/axiosRide";
import axiosDriver from "../../../service/axios/axiosDriver";
const ENDPOINT = import.meta.env.VITE_DRIVER_SERVER_URL;

function UserCurrentRide() {
  const { user_id, user } = useSelector((store:any) => store.user);
  const userToken = localStorage.getItem("userToken");
  const [userData, setuserData] = useState<UserInterface | null>(null);
  userData;
  user;
  const getUserData = async () => {
    try {
      const { data } = await axiosUser().get(`userData?id=${user_id}`);
      setuserData(data);
    } catch (error) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  ///SOCKET SETUP

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log(ENDPOINT, "Socket end point");
    const socketInstance = socketIOClient(ENDPOINT);
    setSocket(socketInstance);
    socketInstance.on("connect", () => {
      console.log("Socket connected");
    });
    socketInstance.on("rideConfirmed", () => {
      console.log("ride confirmed");
      setrideConfirmed(true);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
      if (socket) {
        setSocket(null);
      }
    };
  }, []);

  const navigate = useNavigate();

  const [rideData, setrideData] = useState<RideDetails>();
  const [driverData, setdriverData] = useState<DriverInterface | null>(null);
  const [feedbacks, setfeedbacks] = useState<null | any>([]);

  const [directionsResponse, setdirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [duration, setduration] = useState<string | undefined>(undefined);
  const [rideConfirmed, setrideConfirmed] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places"],
  });

  const [center] = useState({ lat: 12.9716, lng: 77.5946 });
  const [zoom] = useState(11);
  const [, setmap] = useState<google.maps.Map | undefined>(undefined);

  const getRideData = async () => {
    try {
      const ride_id = localStorage.getItem("currentRide-user");
      if (ride_id) {
        const response = await axiosRide(userToken).get(
          `getCurrentRide?rideId=${ride_id}`
        );
        const { data } = await axiosDriver().get(
          `driverData?driver_id=${response.data.driver_id}`
        );
        setrideData(response.data);
        setdriverData(data);
        setfeedbacks(data?.formattedFeedbacks || null);
      }
    } catch (error) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };

  useEffect(() => {
    getRideData();
  }, []);

  useEffect(() => {
    if (rideData) {
      const getDirectionsData = async () => {
        if (rideData.status === "Confirmed") {
          setrideConfirmed(true);
          const origin = rideData.pickupLocation;
          const destination = rideData.dropoffLocation;
          getDirections(origin, destination);
        } else {
          const { latitude, longitude } = rideData.driverCoordinates;
          const origin = await reverseGeocodeForLocality(latitude, longitude);
          setdriverLocation(origin);
          getDirections(origin, rideData.pickupLocation);
        }
      };
      getDirectionsData();
    }
  }, [rideData]);

  useEffect(() => {
    if (rideData) {
      getDirections(rideData.pickupLocation, rideData.dropoffLocation);
    }
  }, [rideConfirmed]);

  const [driverLocation, setdriverLocation] = useState("");

  const getDirections = async (origin: string, destination: string) => {
    if (rideData) {
      const directionsService = new google.maps.DirectionsService();

      try {
        const result = await directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        });
        setdirectionsResponse(result);
        setduration(result.routes[0].legs[0].duration?.text);
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };

  const [cancelModal, setcancelModal] = useState(false);

  const cancelRide = () => {
    if (socket) {
      const ride_id = localStorage.getItem("currentRide-user");
      socket.emit("rideCancelled", ride_id);
      console.log("ride canceled triggeres");

      localStorage.removeItem("currentRide-user");
      navigate("/");
      toast.success("Ride cancelled successfully!");
    }
  };

  const [tab, settab] = useState(1);

  if (!isLoaded) {
    return (
      <>
        <div className="pr-4 mx-5 w-full text-center">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  return (
    <div>
      <Dialog
        className="bg-transparent"
        open={cancelModal}
        handler={cancelRide}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {cancelModal && (
          <>
            <div className="w-full h-fit rounded-lg bg-gray-50 px-8 pt-8 flex flex-col text-center">
              <div className="text-left">
                <h1 className="text-2xl font-bold text-black">
                  Are you sure want to cancel the ride?
                </h1>
              </div>
              <div className="mt-4 text-left w-full pr-7">
                <h1 className="text-md font-medium text-red-500">
                  Canceling a ride after it has already started may
                  inconvenience your driver and affect their earnings.
                </h1>
                <h1 className="text-xs mt-3 pr-7">
                  It may affect your GO account. So please proceed with caution.
                </h1>
              </div>
              <div className="flex justify-end items-end h-fit mt-7 mb-7 gap-5">
                <button
                  onClick={() => setcancelModal(false)}
                  className="w-[20%] h-10 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                  dismiss
                </button>
                <button
                  onClick={() => cancelRide()}
                  className="btn btn-xs bg-red-400 text-white hover:bg-red-600 relative right-2 rounded-full px-4 py-2 transition-colors duration-300"
                >
                  Cancel ride
                </button>
              </div>
            </div>
          </>
        )}
      </Dialog>

      {rideData && driverData && (
        <>
          <div className="container mx-auto px-2 pb-5 pt-2">
            {/* <div className="mb-4">
              <h1 className="text-4xl font-bold text-blue-800">Current ride</h1>
            </div> */}
            <div className="container w-full h-fit  drop-shadow-xl flex justify-center items-center">
              <div className="w-full h-fit md:grid md:grid-cols-6 md:gap-4 mt-2 rounded-xl">
                <div className="bg-indigo-50 drop-shadow-xl md:col-span-2 rounded-xl pt-1 pb-4 px-1">
                  <Tabs position="relative" variant="unstyled">
                    <div className="px-1 mt-4">
                      <TabList>
                        <Tab
                          sx={{ fontSize: "14px" }}
                          onClick={() => settab(1)}
                        >
                          <h1
                            className={
                              tab === 1
                                ? "font-bold text-indigo-400"
                                : "font-normal"
                            }
                          >
                            Driver Information
                          </h1>
                        </Tab>
                        <Tab
                          sx={{ fontSize: "14px" }}
                          onClick={() => settab(2)}
                        >
                          <h1
                            className={
                              tab === 2
                                ? "font-bold text-indigo-400"
                                : "font-normal"
                            }
                          >
                            Contact
                          </h1>
                        </Tab>
                        <Tab
                          sx={{ fontSize: "14px" }}
                          onClick={() => settab(3)}
                        >
                          <h1
                            className={
                              tab === 3
                                ? "font-bold text-indigo-400"
                                : "font-normal"
                            }
                          >
                            Driver feedbacks
                          </h1>
                        </Tab>
                      </TabList>
                      <TabIndicator
                        className={tab === 1 ? "ml-2" : "ml-0"}
                        mt="-1.5px"
                        height="3px"
                        bg="blue.500"
                        borderRadius="1px"
                      />
                    </div>
                    <TabPanels>
                      <TabPanel>
                        <div className="w-full flex mt-1 h-36  items-center justify-center ">
                          <div className="avatar h-max">
                            <div className="w-36 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                              <img
                                className="rounded-full drop-shadow-xl"
                                src={driverData?.driverImage}
                              />
                            </div>
                          </div>
                        </div>
                        <div className=" text-center">
                          <h1>{driverData?.name}</h1>
                          <div className="md:flex gap-3 md:justify-center">
                            <div className="flex gap-2 justify-center">
                              <h1>Cab model:</h1>
                              <h1> {driverData?.vehicle_details.model}</h1>
                            </div>
                            <div className="flex gap-2 justify-center">
                              <h1>Reg ID:</h1>
                              <h1>
                                {" "}
                                {driverData?.vehicle_details.registerationID.toUpperCase()}
                              </h1>
                            </div>
                          </div>
                          <h1>
                            <strong>9567632318</strong>
                          </h1>
                        </div>
                        <div className="my-3">
                          <hr
                            style={{
                              background: "gray",
                              color: "gray",
                              borderColor: "gray",
                              opacity: "0.2",
                              height: "0.5px",
                              width: "80%",
                              margin: "auto",
                            }}
                          />
                        </div>

                        {!rideConfirmed ? (
                          <>
                            <div className="px-3 mt-3 flex flex-col gap-4">
                              <div>
                                <h1 className="font-semibold text-indigo-400 mb-1">
                                  Driver coming from
                                </h1>
                                <div className="flex">
                                  <img
                                    width="25"
                                    height="25"
                                    src="https://img.icons8.com/nolan/64/1A6DFF/C822FF/a.png"
                                    alt="work-from-home"
                                  />
                                  <h1 className="ml-2 truncate">
                                    {driverLocation}
                                  </h1>
                                </div>
                              </div>
                              <div>
                                <h1 className="font-semibold text-indigo-400 mb-1">
                                  Will pick you from
                                </h1>
                                <div className="flex">
                                  <img
                                    width="25"
                                    height="25"
                                    src="https://img.icons8.com/nolan/64/1A6DFF/C822FF/b.png"
                                    alt="work-from-home"
                                  />
                                  <h1 className="ml-2 truncate">
                                    {rideData?.pickupLocation}
                                  </h1>
                                </div>
                              </div>
                              <div>
                                <h1 className="font-semibold text-indigo-400 mb-1">
                                  Driver arrives in
                                </h1>
                                <div className="flex">
                                  <img
                                    width="25"
                                    height="25"
                                    src="https://img.icons8.com/nolan/64/1A6DFF/C822FF/time.png"
                                    alt="work-from-home"
                                  />
                                  <h1 className="ml-2">{duration}</h1>
                                </div>
                              </div>
                              <div className="">
                                <h1 className="font-bold text-indigo-400">
                                  OTP for Driver Confirmation
                                </h1>
                                <div className="flex justify-center  items-center h-12 mt-1 mb-2">
                                  <h1 className="font-bold text-4xl text-indigo-700 tracking-widest">
                                    {rideData?.pin}
                                  </h1>
                                </div>
                                <div className="md:flex md:justify-between text-center md:text-left gap-1 bg-gray-100 rounded-2xl drop-shadow-lg items-center md:px-5 px-7 py-2">
                                  <h1 className="text-[8pt] md:w-40">
                                    Canceling a confirmed ride may affect your
                                    Go account. Please proceed with caution.
                                  </h1>
                                  <button
                                    onClick={() => setcancelModal(true)}
                                    className="btn w-[50%] ml-4 bg-red-400 text-white hover:bg-red-600 relative right-2 rounded-full px-4 py-2 transition-colors duration-300"
                                  >
                                    cancel the ride
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="px-3 mt-3">
                              <h1 className="font-bold text-indigo-400">
                                Ride Details
                              </h1>
                            </div>
                            <div className=" px-5 py-5 flex flex-col gap-6">
                              <div className="flex  gap-2">
                                <img
                                  width="25"
                                  height="25"
                                  src="https://img.icons8.com/nolan/64/1A6DFF/C822FF/street-view.png"
                                  alt="work-from-home"
                                />
                                <h1 className="truncate">
                                  {rideData?.pickupLocation}
                                </h1>
                              </div>
                              <div className="flex  gap-2">
                                <img
                                  width="25"
                                  height="25"
                                  src="https://img.icons8.com/nolan/64/1A6DFF/C822FF/home-page.png"
                                  alt="work-from-home"
                                />
                                <h1 className="truncate">
                                  {rideData?.dropoffLocation}
                                </h1>
                              </div>

                              <div className="flex  justify-start gap-5">
                                <div className="flex gap-2">
                                  <img
                                    width="25"
                                    height="25"
                                    src="https://img.icons8.com/nolan/64/1A6DFF/C822FF/time.png"
                                    alt="work-from-home"
                                  />
                                  <h1 className="truncate">
                                    {rideData?.duration}
                                  </h1>
                                </div>
                                <div className="flex gap-2">
                                  <img
                                    width="25"
                                    height="25"
                                    src="https://img.icons8.com/nolan/64/1A6DFF/C822FF/point-objects.png"
                                    alt="work-from-home"
                                  />
                                  <h1 className="truncate">
                                    {rideData?.distance}
                                  </h1>
                                </div>
                                <div className="flex gap-2">
                                  <img
                                    width="25"
                                    height="25"
                                    src="https://img.icons8.com/nolan/64/1A6DFF/C822FF/banknotes.png"
                                    alt="work-from-home"
                                  />
                                  <h1 className="truncate">
                                    ₹{rideData?.price}
                                  </h1>
                                </div>
                              </div>
                              <div className="my-1">
                                <hr
                                  style={{
                                    background: "gray",
                                    color: "gray",
                                    borderColor: "gray",
                                    opacity: "0.2",
                                    height: "0.5px",
                                    width: "80%",
                                    margin: "auto",
                                  }}
                                />
                              </div>
                              <div className="text-center">
                                <h1 className="font-bold text-2xl text-indigo-400">
                                  Your safety is our top priority. Have a smooth
                                  journey!
                                </h1>
                              </div>
                            </div>
                          </>
                        )}
                      </TabPanel>
                      <TabPanel>
                        <div className="bg-white rounded-2xl pt-3 px-3 md:h-[38.5rem] w-full flex flex-col justify-between">
                          <div className="h-[20rem] md:h-[35.5rem] pb-2 chat-container overflow-y-auto">
                            {/* <ChatList /> */}
                          </div>
                          <div className="mb-3 w-full">
                            {/* <ChatInputField addMessage={""} /> */}
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div className="bg-indigo-50 rounded-2xl pt-3 px-3 md:h-[38.5rem] w-full">
                          <div className="h-[20rem] md:h-[35.5rem] pb-2 chat-container overflow-y-auto">
                            <div className="grid gap-3">
                              {feedbacks.map((feedbacks: any) => {
                                return (
                                  <div className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                      <h2 className="card-title">
                                        "{feedbacks.feedback}"
                                      </h2>
                                      <div className="card-actions mt-1 ml-2">
                                        <div className="rating gap-1">
                                          <input
                                            checked={feedbacks.rating === 1}
                                            type="radio"
                                            name="rating"
                                            className="mask mask-heart bg-red-400"
                                          />
                                          <input
                                            checked={feedbacks.rating === 2}
                                            type="radio"
                                            name="rating"
                                            className="mask mask-heart bg-red-400"
                                          />
                                          <input
                                            checked={feedbacks.rating === 3}
                                            type="radio"
                                            name="rating"
                                            className="mask mask-heart bg-red-400"
                                          />
                                          <input
                                            checked={feedbacks.rating === 4}
                                            type="radio"
                                            name="rating"
                                            className="mask mask-heart bg-red-400"
                                          />
                                          <input
                                            checked={feedbacks.rating === 5}
                                            type="radio"
                                            name="rating"
                                            className="mask mask-heart bg-red-400"
                                          />
                                        </div>
                                      </div>
                                      <div className="w-full text-right">
                                        <p>{feedbacks.formattedDate}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </div>

                <div className="drop-shadow-xl h-96 mt-5 md:mt-0 md:h-auto w-full md:col-span-4 rounded-xl">
                  <GoogleMap
                    center={center}
                    zoom={zoom}
                    mapContainerStyle={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "4%",
                    }}
                    options={{
                      zoomControl: false,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                    }}
                    onLoad={(map) => setmap(map as google.maps.Map)}
                  >
                    {directionsResponse && (
                      <DirectionsRenderer directions={directionsResponse} />
                    )}
                  </GoogleMap>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!rideData && (
        <div className="w-full text-center my-3">
          <h1>No active rides</h1>
        </div>
      )}
    </div>
  );
}

export default UserCurrentRide;
