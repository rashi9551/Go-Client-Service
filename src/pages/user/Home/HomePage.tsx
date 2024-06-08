/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux"
import Home from "../../../components/user/Home/Home"
import DriverSearching from "../../../components/DriverSearching"

function HomePage() {
  const { isOpen } = useSelector((store: any) => store.driverSearch)
  return (
    <>
        {isOpen && <DriverSearching />}
      <Home/>
    </>
  )
}

export default HomePage
