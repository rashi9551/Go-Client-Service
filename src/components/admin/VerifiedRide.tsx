/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import {
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    Typography,
    CardBody,
    Chip,
    Input,
    Tabs,
    Tab,
    TabsHeader,
} from "@material-tailwind/react";
import axiosRide from '../../service/axios/axiosRide'
import { RideDetails } from "../../utils/interfaces";
import {toast} from 'sonner' ;

const VerifiedRides = ({params}:{params:string}) => {
    const { id } = useParams();

    const TABS = [
        {
            label: "All",
            value: "All",
        },
        {
            label: "Completed",
            value: "Completed",
        },
        {
            label: "Cancelled",
            value: "Cancelled",
        },
    ];

    const TABLE_HEAD = ["No", "Pickup", "Dropoff", "Status", "Date"];

    const [rideData, setrideData] = useState<null | RideDetails[]>([])


    const getData = async () => {
        try {
            const adminToken=localStorage.getItem('adminToken')
            const { data } = await axiosRide(adminToken).get(`getAllRides?id=${id}&message=${params}`)
            console.log(data);
            setrideData(data) 
        } catch (error) {
            toast.error((error as Error).message)
            console.log(error);
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const [filteredRideData, setFilteredRideData] = useState<RideDetails[] | null>(rideData)
    const [filterValue, setfilterValue] = useState("All")

    useEffect(() => {
        if (filterValue === 'All') {
            setFilteredRideData(rideData);
        } else {
            if(rideData){
                const filteredData = rideData?.filter(ride => ride.status === filterValue);
                setFilteredRideData(filteredData ? filteredData : null);

            }
        }
    }, [filterValue, rideData]);

    const [search, setSearch] = useState('');

    useEffect(() => {
        if(rideData){
            const filteredData = rideData?.filter(ride =>
                ride.pickupLocation.toLowerCase().includes(search.toLowerCase()) ||
                ride.dropoffLocation.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredRideData(filteredData ? filteredData : null);

        }
    }, [search, rideData]);

  return (
    <>

            <Card className="h-full - w-full"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <CardHeader floated={false} shadow={false} className="rounded-none"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <div className="mt-2  flex flex-col justify-between gap-8 md:flex-row md:items-center">
                        <Tabs value={filterValue} className="w-full md:w-max">
                            <TabsHeader  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {TABS.map(({ label, value }) => (
                                    <Tab
                                        onClick={() => setfilterValue(value)}
                                        key={value} value={value}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                        &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                    </Tab>
                                ))}
                            </TabsHeader>
                        </Tabs>

                        <div className="flex w-full shrink-0 gap-2 md:w-max">
                            <div className="w-full md:w-72">
                                <Input
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                                  label="Search"
                                  icon={<MagnifyingGlassIcon className="h-5 w-5" />} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="max-h-96 overflow-y-auto px-0 driver-ride-table"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                    <table className="w-full min-w-max table-auto text-center ">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head}
                                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRideData?.map(
                                (
                                    {
                                        pickupLocation,
                                        dropoffLocation,
                                        status,
                                        date,
                                    },
                                    index,
                                ): any => {
                                    const isLast = index === filteredRideData?.length - 1;

                                    const classes = isLast
                                        ? "p-4 text-center"
                                        : "p-4 border-b border-blue-gray-50 text-center";

                                    return (
                                        <tr key={index}>
                                            <td className={classes + " w-2"}>
                                                <div className="flex justify-center gap-3">
                                                    <Typography  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        {index + 1}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={classes + " max-w-[15rem]"}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    {pickupLocation}
                                                </Typography>
                                            </td>
                                            <td className={classes + " max-w-[15rem]"}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    {dropoffLocation}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <div className="w-fit  mx-auto">
                                                    <Chip
                                                        size="sm"
                                                        variant="ghost"
                                                        value={status}
                                                        color={
                                                            status === "Completed"
                                                                ? "green"
                                                                : status === "Pending"
                                                                    ? "cyan"
                                                                    : status === "Confirmed"
                                                                        ? "purple"
                                                                        : status === "Cancelled"
                                                                            ? "red"
                                                                            : "yellow"
                                                        }
                                                    />
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex justify-center gap-3">
                                                    <div className="flex flex-col">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal opacity-70"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                        >
                                                            {date}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* <td className={classes} >
                                                <Button
                                                    onClick={() => dispatch(openDriverRideData(ride_id))}
                                                    size="sm" variant="text" className="rounded-full mx-auto h-fit w-fit" children={"more details"}></Button>
                                            </td> */}
                                        </tr>
                                    );
                                },
                            )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>

        </>
  )
}

export default VerifiedRides