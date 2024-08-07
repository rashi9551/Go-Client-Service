import  DriverNavbar  from "../../../components/driver/DirverNavbar";
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator } from "@chakra-ui/react";
import { useState } from "react";
import DriverCurrentRide from '../../../components/driver/Rides/DriverCurrentRide';
import DriverRideHistory from "../../../components/driver/Rides/DriverRideHistory";
import { useSelector } from "react-redux";
import DriverRideDetails from "../../../components/driver/Rides/DriverRideDetails";


const  DriverRidesPage = () => {
    const { isOpenDriverRideData, ride_id } = useSelector((store: {driverRideData:{isOpenDriverRideData:boolean,ride_id:string}}) => store.driverRideData);

    const [tab, settab] = useState(1);

    return (
        <>
            <DriverNavbar />
            <div className="admin-container rounded-3xl bg-teal-50 drop-shadow-xl md:mx-[8rem] mt-[2.5rem] pt-8 pb-4 mb-8">
                <Tabs position="relative" variant="unstyled">
                    <div className="md:ml-5">
                        <TabList>
                            <Tab sx={{ fontSize: "24px" }} onClick={() => settab(1)}>
                                <h1 className={tab === 1 ? "font-bold" : "font-normal"}>Current Ride</h1>
                            </Tab>
                            <Tab sx={{ fontSize: "24px" }} onClick={() => settab(2)}>
                                <h1 className={tab === 2 ? "font-bold " : "font-normal"}>All Rides</h1>
                            </Tab>
                        </TabList>
                        <TabIndicator mt="-1.5px" height="3px" bg="blue.500" borderRadius="1px" />
                    </div>
                    <TabPanels>
                        <TabPanel>
                            <DriverCurrentRide />
                        </TabPanel>
                        <TabPanel>
                        {isOpenDriverRideData ? <DriverRideDetails ride_id={ride_id} /> :
                                <DriverRideHistory />}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </>
    )
}

export default DriverRidesPage