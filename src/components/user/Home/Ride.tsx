/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@material-tailwind/react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient, { Socket } from 'socket.io-client'
import { cancelSearching, startSearching } from '../../../service/redux/slices/driverSearchSlice';


function Ride() {
  const dispatch=useDispatch()

  const [noDriversModal, setnoDriversModal] = useState(false)
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [dropoffLocation, setDropoffLocation] = useState<string>("");
  const [pickupCoordinates, setpickupCoordinates] = useState({
    latitude: "",
    longitude: "",
  });
  const [dropoffCoordinates, setdropoffCoordinates] = useState({
    latitude: "",
    longitude: "",
  });

  const { user_id } = useSelector((store: any) => store.user);

  const [map, setmap] = useState<google.maps.Map | undefined>(undefined);
  const [center, setcenter] = useState({ lat: 13.003371, lng: 77.589134 });
  const [zoom, setzoom] = useState(9);

  const originRef: any = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);

  const [directionsResponse, setdirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setdistance] = useState<string | undefined>(undefined);
  const [duration, setduration] = useState<string | undefined>(undefined);

  const [socket,setSocket]=useState<Socket|null>(null)
  const driverServerUrl=import.meta.env.DRIVER_SERVER_URL || "http://localhost:3003"

  useEffect(()=>{
    const socketInstance=socketIOClient(driverServerUrl)

    setSocket(socketInstance);
    console.log("Socket connected to client");

    socketInstance.on("userConfirmation",(rideId)=>{
      localStorage.setItem("currentRide-user",rideId)
      dispatch(cancelSearching())
      // navigate('/rides')
    })
    return () => {
      if (socketInstance) {
          socketInstance.disconnect();
      }
  };
    
    
  },[])

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(latitude, longitude);

      return new Promise<string>((resolve, reject) => {
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            const addressComponents = results[0].address_components;
            let address = "";

            for (const component of addressComponents) {
              if (component.types.includes("route")) {
                address += component.long_name + ", ";
              }
              if (component.types.includes("neighborhood")) {
                address += component.long_name + ", ";
              }
              if (component.types.includes("sublocality_level_3")) {
                address += component.long_name + ", ";
              }
              if (component.types.includes("sublocality_level_2")) {
                address += component.long_name + ", ";
              }
              if (component.types.includes("sublocality_level_1")) {
                address += component.long_name + ", ";
              }
              if (component.types.includes("locality")) {
                address += component.long_name + ", ";
              }
              if (component.types.includes("administrative_area_level_1")) {
                address += component.long_name + ", ";
              }
              if (component.types.includes("country")) {
                address += component.long_name;
              }
            }

            // Remove trailing commas and spaces
            address = address.replace(/,\s*$/, "");

            console.log("Geocoded address:", address);
            resolve(address);
          } else {
            console.error("Geocoding failed:", status, results);
            reject("Getting location failed");
          }
        });
      });
    } catch (error: any) {
      console.error("Geocoding error:", error);
      return error.message;
    }
  };

  const fromLocation = async () => {
    console.log("dfsbsdbshd");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationDetails: string = await reverseGeocode(
            latitude,
            longitude
          );
          if (originRef.current) {
            originRef.current.value = locationDetails;
            setPickupLocation(locationDetails);
          }
          setcenter({ lat: latitude, lng: longitude });
          map?.panTo(center);
          setzoom(16);
        },
        (error) => {
          toast.error(error.message);
        }
      );
    }
  };

  const toLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const locationDetails = await reverseGeocode(latitude, longitude);
          if (destinationRef.current) {
            destinationRef.current.value = locationDetails;
            setDropoffLocation(locationDetails);
          }
          setcenter({ lat: latitude, lng: longitude });
          map?.panTo(center);
          setzoom(16);
        },
        (error) => {
          toast.error(error.message);
        }
      );
    }
  };

  const calculateRoute = async () => {
    const originValue: any = originRef.current?.value;
    const destinationValue: any = destinationRef.current?.value;
    if (!originRef || !destinationRef) {
      return toast.error("Please choose the pickup and drop0ff locations");
    }

    if (originValue === destinationValue) {
      return toast.error("Please choose different locations!");
    }

    if (
      originValue &&
      destinationRef.current?.value &&
      originValue != destinationValue
    ) {
      setPickupLocation(originValue);
      setDropoffLocation(destinationValue);
      const pickupCoords: any = await geocoeLocation(originValue);
      setpickupCoordinates(pickupCoords);
      const dropCoords: any = await geocoeLocation(destinationValue);
      setdropoffCoordinates(dropCoords);
    }

    const directionsService = new google.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin: originValue,
        destination: destinationValue,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setdirectionsResponse(result);
      setdistance(result.routes[0].legs[0].distance?.text);
      setduration(result.routes[0].legs[0].duration?.text);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const geocoeLocation = async (locationName: string) => {
    try {
      const geocoder = new google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: locationName }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            const location = results?.[0].geometry.location;
            const latitude = location.lat();
            const longitude = location.lng();
            resolve({ latitude, longitude });
          } else {
            reject("Google failed");
          }
        });
      });
    } catch (error: any) {
      return error.message;
    }
  };

  const clearRoutes = () => {
    setdirectionsResponse(null);
    setdistance(undefined);
    setduration(undefined);
    if (originRef.current) {
      originRef.current.value = "";
    }
    if (destinationRef.current) {
      destinationRef.current.value = "";
    }
  };

  interface Charges {
    standard: number;
    sedan: number;
    suv: number;
    premium: number;
  }

  let charges: Charges = {
    standard: 0,
    sedan: 0,
    suv: 0,
    premium: 0,
  };

  if (duration && distance) {
    charges = {
      sedan: Math.floor(parseFloat(distance) * 50),
      standard: Math.floor(parseFloat(distance) * 70),
      suv: Math.floor(parseFloat(distance) * 90),
      premium: Math.floor(parseFloat(distance) * 120),
    };
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places"],
  });

  const handleModelSelection = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.value) {
      case "Standard":
        formik.setFieldValue("vehicleModel", "Standard");
        formik.setFieldValue("price", charges.standard);
        break;
      case "SUV":
        formik.setFieldValue("vehicleModel", "SUV");
        formik.setFieldValue("price", charges.suv);
        break;
      case "Premium":
        formik.setFieldValue("vehicleModel", "Premium");
        formik.setFieldValue("price", charges.premium);
        break;
      case "Sedan":
        formik.setFieldValue("vehicleModel", "Sedan");
        formik.setFieldValue("price", charges.sedan);
        break;
    }
  };

  const generateRandomString = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    let randomString = "";

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      randomString += digits[randomIndex];
    }

    return randomString;
  };

  const initialValues = {
    ride_id: generateRandomString(),
    user_id: user_id,
    pickupLocation: "",
    dropoffLocation: "",
    pickupCoordinates: {},
    dropoffCoordinates: {},
    distance: "",
    duration: "",
    vehicleModel: "",
    price: 0,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      vehicleModel: Yup.string()
        .min(3, "Please choose an option!")
        .required("Please choose an option!"),
    }),
    onSubmit: async (values) => {
      if (!user_id) {
        return toast.error("Please login to book the cab!")
    }
    console.log("request confirm aayi")
    socket?.emit('getNearByDrivers',values)
    dispatch(startSearching())
    noDrivers()
    },
  });

  const noDrivers = () => {
    setTimeout(() => {
        dispatch(cancelSearching())
        setnoDriversModal(true)
    }, 5000);
}

  const showError = () => {
    if (formik.errors.vehicleModel) {
      toast.error(formik.errors.vehicleModel);
    }
  };

  useEffect(() => {
    formik.setFieldValue("pickupLocation", pickupLocation);
    formik.setFieldValue("dropoffLocation", dropoffLocation);
  }, [pickupLocation, dropoffLocation]);

  useEffect(() => {
    formik.setFieldValue("pickupCoordinates", pickupCoordinates);
    formik.setFieldValue("dropoffCoordinates", dropoffCoordinates);
  }, [pickupCoordinates, dropoffCoordinates]);

  useEffect(() => {
    formik.setFieldValue("distance", distance);
  }, [distance]);

  useEffect(() => {
    formik.setFieldValue("duration", duration);
  }, [duration]);

  if (!isLoaded) {
    return <div>its coming</div>;
  }

  return (
    <>
     {noDriversModal &&

<>
    <div x-data={{ isOpen: true }} className="relative flex justify-center">
        <div
            className="fixed inset-0 z-10 overflow-y-auto bg-opacity-50 bg-black"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>

                <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-righ  sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
                    <div>
                        <div className="mt-2 text-center">
                            <h1 className="text-xl font-bold mb-2">Taking longer than usual!</h1>
                            <h1 className="my-2 text-sm">Dont worry, we got you!<br /> We're trying our best to get you a driver.</h1>

                            <div className="flex h-20 w-full items-center justify-center">
                                {/* <span className="loading loading-ring loading-lg"></span> */}

                                <div className="loader2 h-15 w-15">
                                    <span className="hour"></span>
                                    <span className="min"></span>
                                    <span className="circel"></span>
                                </div>
                            </div>

                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                All the drivers seems busy. But if you ready to wait little more, we can get you the best driver available
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 sm:flex sm:items-center sm:justify-center">
                        <div className="sm:flex sm:items-center ">
                            <button
                                onClick={() => setnoDriversModal(false)}
                                className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-black border border-black hover:bg-black hover:text-white capitalize transition-colors duration-300 transform rounded-md sm:w-auto sm:mt-0 focus:outline-none "
                            >
                                CANCEL SEARCHING
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</>

}
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-bold text-blue-800">Book a Safe Ride!</h1>
      </div>

      <div className="container w-full md:flex md:items-start md:gap-10 grid grid-rows-2 gap-5 py-6">
        <div className="md:w-1/3 w-full mt-3 bg-white shadow-lg rounded-lg p-6">
          <div className="grid gap-8">
            <div className="w-full flex gap-4 items-end">
              <div className="w-4/5">
                <Autocomplete>
                  <Input
                    variant="standard"
                    label="Where from?"
                    inputRef={originRef}
                    className="w-full"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                </Autocomplete>
              </div>
              <div className="tooltip" data-tip="Choose your current location">
                <button
                  onClick={() => fromLocation()}
                  className="bg-black px-5 py-1.5 rounded-lg hover:bg-gray-800 transition duration-300"
                >
                  <GpsFixedIcon className="text-white" />
                </button>
              </div>
            </div>
            <div className="w-full flex gap-4 items-end">
              <div className="w-4/5">
                <Autocomplete>
                  <Input
                    variant="standard"
                    label="Where to?"
                    inputRef={destinationRef}
                    className="w-full"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                </Autocomplete>
              </div>
              <div className="tooltip" data-tip="Choose your current location">
                <button
                  onClick={() => toLocation()}
                  className="bg-black px-5 py-1.5 rounded-lg hover:bg-gray-800 transition duration-300"
                >
                  <GpsFixedIcon className="text-white" />
                </button>
              </div>
            </div>
            <div className="w-full flex gap-2">
              <button
                onClick={calculateRoute}
                className="w-3/5 h-10 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
              >
                SEARCH FOR CABS
              </button>
              <button
                onClick={clearRoutes}
                className="w-2/5 h-10 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition duration-300"
              >
                CLEAR
              </button>
            </div>
          </div>

          {distance && duration && (
            <>
              <div className="flex mt-6 flex-row gap-3 items-center">
                <div className="basis-1/2 text-white bg-black shadow-lg rounded-xl h-24 flex flex-col justify-center items-center">
                  <h1 className="text-xs font-bold">Total Distance</h1>
                  <h1 className="font-bold text-3xl">{distance}</h1>
                </div>

                <div className="basis-1/2 text-white bg-black shadow-lg rounded-xl h-24 flex flex-col justify-center items-center">
                  <h1 className="text-xs font-bold">Total Duration</h1>
                  <h1 className="font-bold text-3xl">{duration}</h1>
                </div>
              </div>

              <div className="row-span-2 w-full pt-2 overflow-hidden">
                <form onSubmit={formik.handleSubmit} className="mt-9">
                  <div className="flex overflow-x-auto pb-4 car-selection">
                    <div className="flex gap-4">
                      {[
                        {
                          value: "Sedan",
                          label: "Sedan",
                          recommended: true,
                          image: "images/sedan.png",
                          price: charges.sedan,
                        },
                        {
                          value: "Standard",
                          label: "Standard",
                          recommended: false,
                          image: "images/standard.png",
                          price: charges.standard,
                        },
                        {
                          value: "SUV",
                          label: "SUV",
                          recommended: false,
                          image: "images/suv.png",
                          price: charges.suv,
                        },
                        {
                          value: "Premium",
                          label: "Premium",
                          recommended: false,
                          image: "images/premium.png",
                          price: charges.premium,
                        },
                      ].map((car, index) => (
                        <div
                          key={index}
                          className="w-36 h-[140px] py-2 px-2 rounded-2xl border border-deep-orange-100 hover:border-green-500 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div className="flex items-center gap-1 mb-2">
                            <input
                              type="radio"
                              value={car.value}
                              onChange={handleModelSelection}
                              name="vehicleModel"
                              className="radio-xs checked:bg-blue-500"
                            />
                            <h1 className="text-xs">{car.label}</h1>
                            {car.recommended && (
                              <span>
                                <h1 className="text-[9px] mt-[3px] text-teal-500">
                                  Recommended
                                </h1>
                              </span>
                            )}
                          </div>
                          <div className="pl-5 mb-2">
                            <h1 className="text-sm font-semibold">
                              ₹{car.price}/-
                            </h1>
                          </div>
                          <div
                            className="h-20 bg-cover bg-center rounded-2xl"
                            style={{
                              backgroundImage: `url(${car.image})`,
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full mt-5">
                    <button
                      type="submit"
                      className="w-full h-10 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300"
                      onClick={
                        formik.values.vehicleModel==="" ? () => showError() : () => null
                      }
                    >
                      Confirm the Ride
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>

        <div className="md:w-2/3 w-full md:h-[32rem] h-auto">
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
            <Marker position={center} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
    </>
  );
}

export default Ride;
