/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {toast} from 'sonner' ;
import axiosDriver from "../../../service/axios/axiosDriver";
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { reverseGeocodeForLocality } from "../../../Hooks/Map";
import { Dialog } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { ChatMessage, DriverInterface, RideDetails } from "../../../utils/interfaces";
import ChatBoxReciever from "../../ChatBoxReciever";
import ChatBoxSender from "../../ChatBoxSender";
import ChatInputField from "../../ChatInputField";

const ENDPOINT = import.meta.env.VITE_SERVER_URL;

function DriverCurrentRide() {
  const navigate = useNavigate();
  const { driverId } = useSelector(
    (store: { driver: { driverId: string } }) => store.driver
  );
  const driverToken: string | null = localStorage.getItem("driverToken");
  const refreshTokn: string | null =localStorage.getItem('DriverRefreshToken')
  const [cancelledModal, setcancelledModal] = useState(false);
  const [paymentMode, setpaymentMode] = useState("")
  const [charge, setcharge] = useState(0)
  
  const sendMessageToSocket = (chat: ChatMessage[]) => {
    socket?.emit("chat", chat)
  }



const ChatList = () => {
    return chats.map((chat, index) => {
        if (chat.sender === driverId) return <ChatBoxSender avatar={chat.avatar} message={chat.message}  />
        return <ChatBoxReciever key={index} message={chat.message} avatar={chat.avatar} />
    })
}
  // socket setup
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chats, setchats] = useState<any[]>([])


  useEffect(() => {
    console.log(driverToken,"_+_+_+_+_+_");
    
    const socketInstance = socketIOClient(ENDPOINT, {
      query: {token: driverToken,refreshToken:refreshTokn}
    });
    setSocket(socketInstance);

    socketInstance.on('tokens-updated', (data) => {
      console.log('Tokens updated:', data);
      const token=data.token
      const refreshToken=data.refreshToken
      localStorage.setItem(token,'driverToken')
      localStorage.setItem(refreshToken,'DriverRefreshToken')
    
      socketInstance.io.opts.query = {
        token: token,
        refreshToken: refreshToken
      };
    });

    socketInstance.on("rideConfirmed", (data) => {
        if(data.driverId===driverId){
          console.log("ride confirmed in driver side");
          setrideConfirmed(true);
        }
      });
      
      socketInstance.on("driverPaymentSuccess", (paymentMode, amount,driver_id) => {
        if(driver_id===driverId){
          setopenPayment(false)
          setpaymentMode(paymentMode)
          setcharge(amount)
          setpaymentModeInfo(true)
          if (paymentMode !== 'Cash in hand') {
              setstartCounter(true)
          }
        }
    })
    socketInstance.on("rideCancelled", (driver_id) => {
      if(driver_id===driverId){
        console.log("ride cancelled in driver side ");
        setcancelledModal(true)
      }
    });

    socketInstance.on("chat", (senderChats,data) => {
      if(data.driverId===driverId){
        console.log("its comin g in driver side");
        setchats(senderChats)
      }
  })

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
      if (socket) {
        setSocket(null);
      }
    };
  }, []);

  const [openPayment, setopenPayment] = useState(false);

    const handlePaymentModal = () => {
        setopenPayment(!openPayment)
        socket?.emit("driverRideFinish")
    }

    const [paymentModeInfo, setpaymentModeInfo] = useState(false)


  const [driverData, setdriverData] = useState<DriverInterface|null>(null);
  const [rideConfirmed, setrideConfirmed] = useState(false);
  const [rideData, setrideData] = useState<RideDetails | null>(null);
  const getData = async () => {
    try {
      const rideId = localStorage.getItem("currentRide-driver");
      const response = await axiosRide(driverToken).get(
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

  const addMessage = (message: string) => {
    console.log(message,driverData?.driverImage,driverId);
    const newChat = {
        who:'driver',
        message,
        sender: driverId,
        avatar: driverData?.driverImage
    };
    setchats((prevChats) => [...prevChats, newChat])
    sendMessageToSocket([...chats, newChat])
}


  const [pin, setpin] = useState<number>(0);
  const handleOtpChange = (index: number, newValue: number) => {
    const newpin = [...pin.toString()];
    newpin[index] = newValue.toString();
    setpin(parseInt(newpin.join("")));
  };

  const verifyPIN = async () => {
    const newPin = pin.toString()
    if (newPin.length < 6) {
        toast.error("Please enter a PIN")
    } else if (pin === rideData?.pin) {
        try {
            socket?.emit("verifyRide", pin)
            toast.success("Ride Confirmed Successfully")
        } catch (error) {
            toast.error("something went wrong")
        }
    } else {
        toast.error("Please enter a valid PIN")
    }
}

const [openFinishModal, setopenFinishModal] = useState(false);
const handleOpenFinishModal = () => setopenFinishModal(!openFinishModal);

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
    } else {
      console.log("ride data vannitilla");
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
        console.log(result, "ithu result");
        setdirectionsResponse(result);
      } catch (error) {
        console.log(error, "ithu error");
        toast.error((error as Error).message);
      }
    }
  };

  useEffect(() => {
    if (rideData) {
        getDirections(rideData.pickupLocation, rideData.dropoffLocation)
    }
}, [rideConfirmed])

  const clearRide = () => {
    console.log("ride cleared");
    setcancelledModal(false);
    localStorage.removeItem("currentRide-driver");
    navigate("/driver/dashboard");
  };

  const [counter, setCounter] = useState(6);
    const [startCounter, setstartCounter] = useState(false)

    useEffect(() => {
        if (startCounter) {
            counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
        }
        if (counter === 0 && startCounter) {
            confirmPayment()
        }
    }, [counter, startCounter]);


    const confirmPayment = () => {
      setpaymentModeInfo(false)
      toast.success("Payment recieved successfully")
      localStorage.removeItem("currentRide-driver")
      navigate('/driver/dashboard')
    }

    const [tab, settab] = useState(1);

  return (
    <div>
      <>
      <Dialog open={openFinishModal} handler={handleOpenFinishModal} className='bg-transparent' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <div className='w-full h-60 rounded-lg bg-gray-50 px-5 pt-8 flex flex-col text-center'>
              <div className=''>
                  <h1 className='text-2xl font-semibold'>
                      Are you sure you reached the destination?
                  </h1>
              </div>
              <div className='mt-4 w-full px-14'>
                  <h1 className='text-md'>
                      If the destination is reached then finish the ride and passenger will pay the fare amount.
                  </h1>
              </div>
              <div className='flex justify-center items-end h-32 mb-7 gap-5'>
                  <button
                      onClick={handleOpenFinishModal}
                      className='btn btn-xs bg-blue-300  text-black hover:bg-blue-600 relative right-2 rounded-full px-4 py-2 transition-colors duration-300'>dismiss</button>
                  <button
                      onClick={() => {
                          handleOpenFinishModal()
                          handlePaymentModal()
                      }}
                      className='w-[30%] h-10 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300'>finish ride</button>
              </div>
          </div>
      </Dialog>
      <Dialog open={paymentModeInfo} handler={confirmPayment} className='bg-transparent' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <div className='w-full h-fit rounded-lg bg-gray-50 px-5 pt-8 flex flex-col text-center'>
                        <div className=''>
                            <h1 className='text-3xl mb-4 text-green-700 font-semibold'>Payment successfull!</h1>
                            {paymentMode !== "Cash in hand" ? (
                                <h1 className='text-2xl font-semibold px-10 leading-9 text-black'>
                                    Passenger has completed the payment using <span className='text-green-600'>{paymentMode === "Wallet" ? "wallet" : "online method"}</span>
                                </h1>
                            ) : (
                                <h1 className='text-2xl font-semibold px-10 leading-9 text-black'>
                                    Passenger will pay the fare charge <span className='text-green-600'>₹{charge}</span> as CASH IN HAND
                                </h1>
                            )}
                        </div>
                        {paymentMode !== "Cash in hand" ? (
                            <>
                                <div className='mt-4 w-full px-14'>
                                    <h1 className='text-sm px-8 mt-1'>
                                        Payment will be reflected in your wallet within 5 minutes. If not, contact the customer support.
                                    </h1>
                                </div>
                                <div className='flex justify-center items-end h-fit mt-10 mb-7 gap-5'>
                                    {counter > 0 && (
                                        <p className="text-xs font-medium text-green-600">Page will redirect in 00:{counter}</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='mt-4 w-full px-14'>
                                    <h1 className='text-sm px-10'>
                                        Collect the fare amount from passanger and confirm by double checking the cash.
                                    </h1>
                                </div>
                                <div className='flex justify-center items-end h-fit mt-4 mb-7 gap-5'>
                                    <button
                                        className='w-[30%] h-10 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300'
                                        onClick={() => confirmPayment()}
                                    >
                                        confirm payment
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </Dialog>


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

        <Dialog open={openPayment} handler={handlePaymentModal} className='bg-transparent h-72 text-black' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>

          <div className='w-full h-full rounded-lg bg-gray-50 px-5 pt-8 grid grid-rows-6 text-center'>
              <div className='row-span-1'>
                  <h1 className='text-2xl font-semibold'>
                      Waiting for the payment completion
                  </h1>
              </div>
              <div className='flex justify-center items-center gap-3 row-span-1'>
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="38" height="38" viewBox="0 0 48 48">
                      <path fill="#BF360C" d="M35,44c0,0-6-2-11-2s-11,2-11,2V32h22V44z"></path><path fill="#FFA726" d="M14 28c0 2.209-1.791 4-4 4s-4-1.791-4-4 1.791-4 4-4S14 25.791 14 28M42 28c0 2.209-1.791 4-4 4s-4-1.791-4-4 1.791-4 4-4S42 25.791 42 28"></path><path fill="#FFB74D" d="M38,18c0-12.725-28-8.284-28,0v9c0,8.284,6.269,15,14,15s14-6.716,14-15V18z"></path><path fill="#784719" d="M32 26c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2S32 24.895 32 26M20 26c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2S20 24.895 20 26"></path><path fill="#FF5722" d="M24,4C15.495,4,3,9,2.875,36L13,44V24l16.75-9l5.125,7L35,44l10-8c0-12-0.543-29-15-29l-2-3H24z"></path><path fill="#FB8C00" d="M19,35h10c0,0-2,3-5,3S19,35,19,35z"></path>
                  </svg>
                  <span className="loading loading-dots loading-lg"></span>
                  <img width="38" height="38" src="https://img.icons8.com/external-basicons-color-edtgraphics/50/external-Bank-finance-basicons-color-edtgraphics.png" alt="external-Bank-finance-basicons-color-edtgraphics" />
              </div>
              <div className='text center flex flex-col gap-3 row-span-4 mt-4'>
                  {/* <h1 className='uppercase text-left text-xs'>Fare<br/>amount</h1>  */}
                  <h1 className='text-7xl text-green-800'>₹{rideData?.price}</h1>
                  <h1 className='text-xs px-10'>After the successful payment completion, please note that it may take some time for the changes to reflect. Thank you for your patience.</h1>
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
                                onClick={() => verifyPIN()}
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
                                  onClick={handleOpenFinishModal}
                                  className="w-[30%] h-10 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300"
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
                      <div className="h-[17rem] bg-black pb-2 chat-container overflow-y-auto" style={{ backgroundImage: `url(${import.meta.env.VITE_BG_WTS})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <ChatList />
                      </div>
                      <div className="mb-3">
                        <ChatInputField addMessage={addMessage} />
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
