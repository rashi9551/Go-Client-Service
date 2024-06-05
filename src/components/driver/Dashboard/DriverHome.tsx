import Footer from "../../../components/user/Home/Footer";
// import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import DriverDashboard from "./DriverDashboard";
import DirverNavbar from "../DirverNavbar";

function DriverHome() {

  return (
    <div className="">
      <DirverNavbar/>
      <DriverDashboard/>
      <Footer />
    </div>
  );
}

export default DriverHome;
