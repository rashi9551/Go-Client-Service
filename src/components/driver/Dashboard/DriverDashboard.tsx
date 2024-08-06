import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import EmergencyShareIcon from "@mui/icons-material/EmergencyShare";
import { DriverInterface, PieChartData, pieValue, RideDetails } from "../../../utils/interfaces";
import { useEffect, useRef, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosDriver from "../../../service/axios/axiosDriver";
// import axiosRide from "../../../service/axios/axiosRide";
import { toast } from "sonner";
import { Spinner } from "@chakra-ui/react";

export const DriverDashboard = () => {
  const { driverId } = useSelector((store: {driver:{driverId:string}}) => store.driver);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: pieValue) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
              {`${(percent * 100).toFixed(0)}%`}
          </text>
      );
  };

  const [chartData, setchartData] = useState(null)
  const [pieChartData, setpieChartData] = useState<PieChartData[] | []>([])
  const [currentMonthRide, setcurrentMonthRide] = useState(null)
  const [driverData, setdriverData] = useState<DriverInterface | null>(null);

  const getData = async () => {
    try {
        const { data } = await axiosDriver().get(`dashboardData?driver_id=${driverId}`)
        console.log(data,"ithu datey aahney");
        setchartData(data.chartData)
        setpieChartData(data.pieChartData)
        setdriverData(data.driverData);
        setcurrentMonthRide(data.CurrentMonthRides)
    } catch (error) {
        toast.error((error as Error).message)
        console.log(error);
    }
}


useEffect(() => {
    getData();
}, [])


  // const driverToken: string | null = localStorage.getItem("driverToken");
  const [rides, setRides] = useState<RideDetails | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate=useNavigate()
  const audioRef = useRef<HTMLAudioElement|null>(null);
  audioRef.current = new Audio('/uber_tune.mp3');
  const ENDPOINT = import.meta.env.VITE_SERVER_URL;
  
  useEffect(() => {
    const driverToken=localStorage.getItem('driverToken')
    const refreshTokn=localStorage.getItem('DriverRefreshToken')
    const socketInstance = socketIOClient(ENDPOINT, {
      query: {token: driverToken,refreshToken:refreshTokn}
    });
    console.log("socket connected to driver side ",socket);
    setSocket(socketInstance);
    socketInstance.on("connect", () => {
      console.log("Connected to server with ID:", socketInstance.id);
    });

    socketInstance.on('tokens-updated', (data) => {
      console.log("in socket its updated");
      const token=data.token
      const refreshToken=data.refreshToken      
      localStorage.setItem(token,'driverToken')
      localStorage.setItem(refreshToken,'DriverRefreshToken')
      socketInstance.io.opts.query = {
        token: token,
        refreshToken: refreshToken
      };
    });
    socketInstance.on("getNearByDrivers", () => {
      console.log("location edukkunnu");
      console.log(navigator.geolocation);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(latitude,longitude);
            socketInstance?.emit(
              "driverLocation",
              latitude,
              longitude,
              driverId
            );
          },
          (error) => {
            console.log(error.message);
          }
        );
      }
    });

    socketInstance.on('newRideRequest',(rideDetails,driverIdArray)=>{
      if(driverIdArray.includes(driverId)){
        if (audioRef.current) {
          audioRef.current.play();
        }
        console.log(rideDetails,"ride rquest mannu");
        setRides(rideDetails)
        setTimeout(()=>{
          setRides(null)
        },5000)

      }
      console.log(driverIdArray,driverId,"------");
      
    })
    socketInstance.on("driverConfirmation",(rideId,driver_id)=>{
      if(driverId===driver_id){
        localStorage.setItem("currentRide-driver",rideId)
        navigate("/driver/rides");
        socketInstance.emit("forUser",rideId)
      }
    })

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  const handleAcceptRide=async()=>{
    if(socket)
      {
        // const rideCheck = await axiosRide(driverToken).get(
        //   `getCurrentRideCheck?rideId=${rides?.ride_id}`
        // );
        // console.log(rideCheck,rides,"=-=-=-=-=-=-=");
        const driver_id=driverId
        const updateRideDetais={...rides,driver_id}
        socket.emit("acceptRide",updateRideDetais)
        setRides(null)
        console.log("accept ride aaayi");
        
      }
  }



  return (
    <div className="w-[81.5%] h-fit mx-auto my-[2.5rem] bg-gray-100 py-6 rounded-3xl drop-shadow-lg">
      {rides  &&  (<div className="w-[90%] mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center space-x-4 mb-4">
          <EmergencyShareIcon className="text-blue-500 w-6 h-6" />
          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              New Ride Alert!
            </h2>
            <p className="text-sm text-gray-600">
              You have one new ride request.
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center space-x-4">
          <div className="flex flex-col items-start">
            <span className="font-bold">Pickup:</span>
            <span>{rides.pickupLocation}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold">Dropoff:</span>
            <span>{rides.dropoffLocation}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold">Distance:</span>
            <span>{rides.distance}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold">Duration:</span>
            <span>{rides.duration}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold">Charge:</span>
            <span className="font-bold">{rides.price}</span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setRides(null)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
            >
              Deny
            </button>
            <button
              onClick={() => handleAcceptRide()}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
              Accept
            </button>
          </div>
        </div>
      </div>)}
      

      {(!driverData || !chartData || !pieChartData) ? (
                    <>
                        <div className='pr-4 mx-5 w-full text-center'>
                            <Spinner size='lg' />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-[95%] mx-auto md:h-fit h-fit md:grid-cols-3 mt-6  md:gap-8 grid  gap-5 ">
                            <div className="bg-green-200  rounded-3xl md:grid-cols-1 grid grid-rows-5 gap-1 drop-shadow-xl px-1 pb-1">
                                <div className=" row-span-2 flex items-center px-3">
                                    <h1 className="text-2xl font-medium text-white">This month rides</h1>
                                </div>
                                <div className=" row-span-3 flex items-center justify-end">
                                    <h1 className="text-7xl px-2 text-white">{currentMonthRide ? currentMonthRide : 0}</h1>
                                </div>
                            </div>
                            <div className="bg-green-200  rounded-3xl grid grid-rows-5 gap-1 drop-shadow-xl px-1 pb-1">
                                <div className=" row-span-2 flex items-center px-3">
                                    <h1 className="text-2xl font-medium text-white">Total Earnings</h1>
                                </div>
                                <div className=" row-span-3 flex items-center justify-end">
                                    <h1 className="text-7xl px-2 text-white">₹{driverData?.RideDetails?.totalEarnings}</h1>
                                </div>
                            </div>
                            <div className="bg-green-200  rounded-3xl grid grid-rows-5 gap-1 drop-shadow-xl px-1 pb-1">
                                <div className=" row-span-2 flex items-center px-3">
                                    <h1 className="text-2xl font-medium text-white">Total Rides</h1>
                                </div>
                                <div className=" row-span-3 flex items-center justify-end">
                                    <h1 className="text-7xl px-2  text-white">{driverData?.RideDetails?.completedRides}</h1>
                                </div>
                            </div>
                            <div className="bg-green-200  rounded-3xl grid grid-rows-5 gap-1 drop-shadow-xl px-1 pb-1">
                                <div className=" row-span-2 flex items-center px-3">
                                    <h1 className="text-2xl font-medium text-white">Cancelled Rides</h1>
                                </div>
                                <div className=" row-span-3 flex items-center justify-end">
                                    <h1 className="text-7xl px-2  text-white">{driverData?.RideDetails?.cancelledRides}</h1>
                                </div>
                            </div>
                            <div className="bg-green-200  rounded-3xl grid grid-rows-5 gap-1 drop-shadow-xl px-1 pb-1">
                                <div className=" row-span-2 flex items-center px-3">
                                    <h1 className="text-2xl font-medium text-white">Account Status</h1>
                                </div>
                                <div className=" row-span-3 flex items-center justify-end">
                                    <h1 className="text-5xl px-2 uppercase text-white">{driverData?.account_status}</h1>
                                </div>
                            </div>
                            <div className="bg-green-200  rounded-3xl grid grid-rows-5 gap-1 drop-shadow-xl px-1 pb-1">
                                <div className=" row-span-2 flex items-center px-3">
                                    <h1 className="text-2xl font-medium text-white">Total Ratings</h1>
                                </div>
                                <div className=" row-span-3 flex items-center justify-end">
                                    <h1 className="text-7xl px-2  text-white">{driverData?.totalRatings}</h1>
                                </div>
                            </div>
                        </div>
                        <div className=" mt-16 md:grid-cols-2 md:gap-8 grid">
                            <div>
                            <h1 className="pl-8 mb-8 font-bold">EARNINGS PER MONTH</h1>
                                {chartData &&
                                    <LineChart
                                        width={500}
                                        height={300}
                                        data={chartData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="Earnings" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                                    </LineChart>
                                }
                            </div>
                            <div>
                                <h1 className="pb-8 font-bold">PAYMENT METHODS</h1>
                                {pieChartData &&
                                    <PieChart width={400} height={220}>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieChartData.map((_: PieChartData,index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                }
                                <div className="flex gap-5">
                                    <h1 className="text-green-500">Wallet Payment</h1>
                                    <h1 className="text-yellow-700">Cash in hand</h1>
                                    <h1 className="text-blue-700">Card Payment</h1>
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
    );
};

export default DriverDashboard;
