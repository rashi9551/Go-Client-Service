// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import  axiosUser  from '../../../service/axios/axiosUser'
// import { toast } from 'react-toastify'

// const ENDPOINT = import.meta.env.DRIVER_SERVER_UR

// function UserCurrentRide() {

//     const {user_id,user}=useSelector((store:any)=>store.user)

//     const [userData,setuserData]=useState<any|null>(null)

//     const getUserData=async()=>{
//         try{
//             const {data} = await axiosUser().get(`userData?id=${user_id}`)
//             setuserData(data)
//         }catch(error){
//             toast.error((error as Error).message)
//             console.log(error);
//         }
//     }
    
//     useEffect(()=>{
//         getUserData()
//     })


//     const [socket, setSocket] = useState<Socket | null>(null);

//     useEffect(() => {
//     const socketInstance = socketIOClient(ENDPOINT)
//     setSocket(socketInstance)
//     socketInstance.on("rideConfirmed", () => {
//       setrideConfirmed(true)
//     })

//     return () => {
//         if (socketInstance) {
//           socketInstance.disconnect();
//         }
//         if (socket) {
//           setSocket(null)
//         }
//       }
//     }, [])



//     const [rideData, setrideData] = useState<RideDetails>()
//     const [driverData, setdriverData] = useState<any | null>(null)

//     const [directionsResponse, setdirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
//     const [duration, setduration] = useState<string | undefined>(undefined);
//     const [rideConfirmed, setrideConfirmed] = useState(false)

//     const { isLoaded } = useJsApiLoader({
//         googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//         libraries: ["places"],
//       });

//     const [center] = useState({ lat: 12.9716, lng: 77.5946 });
//     const [zoom] = useState(11);
//     const [, setmap] = useState<google.maps.Map | undefined>(undefined);

//     const getRideData = async () => {
//         try {
//           const ride_id = localStorage.getItem("currentRide-user")
//           const response = await axiosUser().get(`getCurrentRide?rideId=${ride_id}`)
//           setrideData(response.data.rideData)
//           setdriverData(response.data.driverData)
//         } catch (error) {
//           toast.error((error as Error).message)
//           console.log(error);
//         }
//       }
    
//       useEffect(() => {
//         getRideData()
//       }, [])


//       useEffect(() => {
//         if (rideData) {
//           const getDirectionsData = async () => {
//             if (rideData.status === "Confirmed") {
//               setrideConfirmed(true)
//               const origin = rideData.pickupLocation
//               const destination = rideData.dropoffLocation
//               getDirections(origin, destination)
//             } else {
//               const { latitude, longitude } = rideData.driverCoordinates
//               const origin = await reverseGeocode(latitude, longitude)
//               setdriverLocation(origin)
//               getDirections(origin, rideData.pickupLocation)
//             }
//           }
//           getDirectionsData()
//         }
//       }, [rideData]);


//       useEffect(() => {
//         if (rideData) {
//           getDirections(rideData.pickupLocation, rideData.dropoffLocation)
//         }
//       }, [rideConfirmed])

//       const [driverLocation, setdriverLocation] = useState("")

//       const getDirections = async (origin: any, destination: any) => {
//         if (rideData) {
//           const directionsService = new google.maps.DirectionsService();
    
//           try {
//             const result = await directionsService.route({
//               origin: origin,
//               destination: destination,
//               travelMode: google.maps.TravelMode.DRIVING
//             })
//             setdirectionsResponse(result)
//             setduration(result.routes[0].legs[0].duration?.text);
    
//           } catch (error) {
//             toast.error((error as Error).message)
//           }
//         }
//       }


//       const reverseGeocode = async (latitude: any, longitude: any) => {
//         try {
//           const geocoder = new google.maps.Geocoder();
//           const latlng = new google.maps.LatLng(latitude, longitude);
    
//           return new Promise((resolve, reject) => {
//             geocoder.geocode({ location: latlng }, (results, status) => {
//               if (status === "OK" && results?.[0]) {
//                 const addressComponents = results[0].address_components;
//                 let locality = "";
    
//                 for (const component of addressComponents) {
//                   if (component.types.includes("route")) {
//                     locality += component.long_name + ", ";
//                   }
//                   if (component.types.includes("neighborhood")) {
//                     locality += component.long_name + ", ";
//                   }
//                   if (component.types.includes("sublocality_level_3")) {
//                     locality += component.long_name + ", ";
//                   }
//                   if (component.types.includes("sublocality_level_2")) {
//                     locality += component.long_name + ", ";
//                   }
//                   if (component.types.includes("sublocality_level_1")) {
//                     locality += component.long_name;
//                   }
//                 }
//                 resolve(locality);
//               } else {
//                 reject("Getting location failed");
//               }
//             });
//           });
//         } catch (error: any) {
//           return error.message;
//         }
//       };

//       if (!isLoaded) {
//         return (
//           <>
//             <div className='pr-4 mx-5 w-full text-center'>
//               <Spinner size='lg' />
//             </div>
//           </>
//         );
//       }
    


      


//   return (
//     <div>
      
//     </div>
//   )
// }

// export default UserCurrentRide
