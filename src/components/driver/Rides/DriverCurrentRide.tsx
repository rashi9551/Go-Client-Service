import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socketIOClient, { Socket } from "socket.io-client";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
import { PinInput, PinInputField, HStack } from "@chakra-ui/react";
import axiosRide from "../../../service/axios/axiosRide";
import { toast } from "react-toastify";
import axiosDriver from "../../../service/axios/axiosDriver";
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { reverseGeocodeForLocality } from "../../../Hooks/Map";
import { Dialog } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { RideDetails } from "../../../utils/interfaces";

const ENDPOINT = import.meta.env.VITE_DRIVER_SERVER_URL;

function DriverCurrentRide() {
  const navigate = useNavigate();
  const { driverId } = useSelector((store: {driver:{driverId:string}}) => store.driver);
  const token: string | null = localStorage.getItem("driverToken");
  const [cancelledModal, setcancelledModal] = useState(false);

  // socket setup
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = socketIOClient(ENDPOINT);
    setSocket(socketInstance);
    socketInstance.on("rideConfirmed", () => {
      console.log("ride confirmed");
      setrideConfirmed(true);
    });

    socketInstance.on("rideCancelled", () => {
      console.log("ride cancelled -----------------------------");
      setcancelledModal(true);
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

  const [driverData, setdriverData] = useState({});
  const [rideConfirmed, setrideConfirmed] = useState(false);
  const [rideData, setrideData] = useState<RideDetails | null>(null);
  const getData = async () => {
    try {
      const rideId = localStorage.getItem("currentRide-driver");
      const response = await axiosRide(token).get(
        `getCurrentRide?rideId=${rideId}`
      );
      if (response.data.ride_id) {
        setrideData(response.data);
      }
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

  const [tab, settab] = useState(1);

  const [pin, setpin] = useState<number>(0);
  const handleOtpChange = (index: number, newValue: number) => {
    const newpin = [...pin.toString()];
    newpin[index] = newValue.toString();
    setpin(parseInt(newpin.join("")));
  };

  useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places"],
  });

  const [center] = useState({ lat: 12.9716, lng: 77.5946 });
  const [zoom] = useState(15);
  const [, setmap] = useState<google.maps.Map | undefined>(undefined);

  const [directionsResponse, setdirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (rideData) {
      console.log("direction data set vannu", driverData, rideData);
      const getDirectionsData = async () => {
        if (rideData.status === "Confirmed") {
          console.log(rideData.status, "direction status okkey");
          setrideConfirmed(true);
          const origin = rideData.pickupLocation;
          const destination = rideData.dropoffLocation;
          getDirections(origin, destination);
        } else {
          const { latitude, longitude } = rideData.driverCoordinates;
          const origin = await reverseGeocodeForLocality(latitude, longitude);
          getDirections(origin, rideData.pickupLocation);
        }
      };
      getDirectionsData();
    }
  }, [rideData]);

  const getDirections = async (origin: string, destination: string) => {
    if (rideData) {
      console.log("origin", origin, destination);

      const directionsService = new google.maps.DirectionsService();
      try {
        const result = await directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        });
        setdirectionsResponse(result);
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };

  const clearRide = () => {
    console.log("ride cleared");
    setcancelledModal(false);
    localStorage.removeItem("currentRide-driver");
    navigate("/driver/dashboard");
  };
  return (
    <div>
      <>
        <Dialog
          open={cancelledModal}
          handler={clearRide}
          className="bg-transparent"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="w-full h-fit rounded-lg bg-gray-50 px-5 pt-8 flex flex-col text-center">
            <div className="">
              <h1 className="text-3xl font-semibold text-red-600">
                Ride Cancelled by Passenger!
              </h1>
            </div>
            <div className="mt-3">
              <h1 className="text-md font-semibold">
                Sorry for the inconvenience
              </h1>
            </div>
            <div className="mt-3 w-full px-8">
              <h1 className="text-sm">
                Passenger Has Cancelled the Ride. Feel Free to Return to Your
                Preferred Location or Start Looking for a New Passenger
                Opportunity.
                <br /> Your Next Fare Awaits!
              </h1>
            </div>
            <div className="flex justify-center items-end mt-4 mb-7 gap-5">
              <button
                onClick={clearRide}
                className="btn btn-xs bg-blue-300  text-black hover:bg-blue-600 relative right-2 rounded-full px-4 py-2 transition-colors duration-300"
              >
                dismiss
              </button>
            </div>
          </div>
        </Dialog>
      </>
      {rideData && (
        <>
          <div className="w-[98%] h-fit mx-auto my-1 bg-indigo-50 py-6 rounded-lg drop-shadow-lg">
            <div className="md:flex w-full gap-4 px-5">
              <div className="md:w-1/2 h-fit  rounded-3xl">
                <Tabs position="relative" variant="unstyled">
                  <div className="mb-2">
                    <TabList>
                      <Tab sx={{ fontSize: "15px" }} onClick={() => settab(1)}>
                        <h1 className={tab === 1 ? "font-bold" : "font-normal"}>
                          Ride details
                        </h1>
                      </Tab>
                      <Tab sx={{ fontSize: "15px" }} onClick={() => settab(2)}>
                        <h1
                          className={tab === 2 ? "font-bold " : "font-normal"}
                        >
                          Contact
                        </h1>
                      </Tab>
                    </TabList>
                    <TabIndicator
                      mt="-1.5px"
                      height="3px"
                      width="1px"
                      bg="blue.500"
                      borderRadius="1px"
                    />
                  </div>

                  <TabPanels>
                    <TabPanel>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-4 w-full h-fit px-3 py-3 drop-shadow-xl rounded-xl bg-gray-100 flex gap-3">
                          <div>
                            <img
                              width="25"
                              height="25"
                              src="https://img.icons8.com/nolan/64/1A6DFF/C822FF/street-view.png"
                              alt="work-from-home"
                            />
                          </div>
                          <h1 className="truncate">
                            {rideData?.pickupLocation}
                          </h1>
                        </div>
                        <div className="col-span-4 w-full h-fit px-3 py-3 drop-shadow-xl rounded-xl bg-gray-100 flex gap-3">
                          <div>
                            <img
                              width="25"
                              height="25"
                              src="https://img.icons8.com/nolan/64/1A6DFF/C822FF/home-page.png"
                              alt="drop-shipping"
                            />
                          </div>
                          <h1 className="truncate">
                            {rideData?.dropoffLocation}
                          </h1>
                        </div>
                        <div className="col-span-2 w-full h-fit px-3 py-3 drop-shadow-xl rounded-xl bg-gray-100 flex gap-3">
                          <div>
                            <img
                              width="25"
                              height="25"
                              src="https://img.icons8.com/nolan/64/1A6DFF/C822FF/time.png"
                              alt="time"
                            />
                          </div>
                          <h1 className="truncate">{rideData?.duration}</h1>
                        </div>
                        <div className="col-span-2 w-full h-fit px-3 py-3 drop-shadow-xl rounded-xl bg-gray-100 flex gap-3">
                          <div>
                            <img
                              width="25"
                              height="25"
                              src="https://img.icons8.com/nolan/64/1A6DFF/C822FF/point-objects.png"
                              alt="point-objects"
                            />
                          </div>
                          <h1 className="truncate">{rideData?.distance}</h1>
                        </div>
                        <div className="col-span-2 w-full h-fit px-3 py-3 drop-shadow-xl rounded-xl bg-gray-100 flex gap-3">
                          <div>
                            <img
                              width="25"
                              height="25"
                              src="https://img.icons8.com/nolan/64/1A6DFF/C822FF/banknotes.png"
                              alt="work-from-home"
                            />
                          </div>
                          <h1 className="truncate">₹{rideData?.price}</h1>
                        </div>

                        {!rideConfirmed ? (
                          <>
                            <div className="col-span-4 w-full px-3 py-3 drop-shadow-xl rounded-xl bg-gray-100 flex gap-3 justify-center items-center">
                              <h1 className="text-sm">
                                Enter the PIN from user to confirm the ride
                              </h1>
                              <HStack className="">
                                <PinInput otp placeholder="">
                                  {[...Array(6)].map((_, index) => (
                                    <PinInputField
                                      key={index}
                                      onChange={(e) =>
                                        handleOtpChange(
                                          index,
                                          parseInt(e.target.value)
                                        )
                                      }
                                    />
                                  ))}
                                </PinInput>
                              </HStack>
                            </div>
                            <div className="col-span-4 justify-center gap-3 text-center mt-1 flex">
                              <button className="btn btn-xs bg-red-400 text-white hover:bg-red-600 relative right-2 rounded-full px-4 py-2 transition-colors duration-300">
                                cancel the ride
                              </button>
                              <button
                                type="button"
                                // onClick={() => verifyPIN()}
                                className="w-[30%] h-10 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300"
                              >
                                confirm the ride
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-span-4">
                              <div className="flex justify-between gap-1 bg-gray-100 rounded-2xl drop-shadow-lg items-center px-7 py-2">
                                <h1 className="text-[11pt] font-bold">
                                  Confirm when you've reached your destination.
                                </h1>
                                <button
                                  // onClick={handleOpenFinishModal}
                                  className="btn btn-accent btn-sm text-white"
                                >
                                  finish the ride
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div className="bg-white rounded-2xl pt-4 px-4 h-80 w-full flex flex-col justify-between">
                        <div className="h-[17rem] pb-2 chat-container overflow-y-auto">
                          {/* <ChatList /> */}
                        </div>
                        <div className="mb-3">
                          {/* <ChatInputField addMessage={addMessage} /> */}
                        </div>
                      </div>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </div>

              <div className="md:w-1/2 mt-8 md:mt-0 h-96 bg-white rounded-3xl drop-shadow-xl">
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

export default DriverCurrentRide;
