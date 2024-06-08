import { useState } from 'react'
import { AdminNavbar } from '../../../components/admin/AdminNavbar'
import { Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import DriverData from '../../../components/admin/Driver/DriverData'

function AdminDriverPage() {
    const [tab,settab]=useState(1)
        console.log("coming");
        
  return (
    <>
            <AdminNavbar />
            <div className="admin-container rounded-3xl bg-gray-100 drop-shadow-xl md:mx-[8rem] mt-[2.5rem] py-8">
                <Tabs position="relative" variant="unstyled">
                    <div className="ml-5">
                        <TabList>
                            <Tab sx={{ fontSize: '24px'}} onClick={() => settab(1)}>
                                <h1 className={tab === 1 ? "font-bold" : "font-normal"}>Verified Drivers</h1>
                            </Tab>
                            <Tab sx={{ fontSize: '24px'}} onClick={() => settab(2)}>
                                <h1 className={tab === 2 ? "font-bold " : "font-normal"}>Pending Drivers</h1>
                            </Tab>
                            <Tab sx={{ fontSize: '24px'}} onClick={() => settab(3)}>
                                <h1 className={tab === 3 ? "font-bold " : "font-normal"}>Blocked Drivers</h1>
                            </Tab>
                        </TabList>
                        <TabIndicator mt="-1.5px" height="3px" bg="blue.500" borderRadius="1px" />
                    </div>
                    <TabPanels>
                        <TabPanel>
                        <DriverData params={"verifiedDrivers"} />
                        </TabPanel>
                        <TabPanel>
                        <DriverData params={"pendingDrivers"} />
                        </TabPanel>
                        <TabPanel>
                        <DriverData params={"blockedDrivers"} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </>
  )
}

export default AdminDriverPage
