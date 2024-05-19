import DriverLogin from "../../../components/driver/Authentication/Login/DriverLogin";
import { useSelector } from "react-redux";
import PendingModal from "../../../components/driver/Authentication/PendingModal";
function DriverLoginPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { isOpenPending } = useSelector((store: any) => store.pendingModal);

    return (
        <div>
            {isOpenPending && <PendingModal />}
            <DriverLogin />
        </div>
    );
}

export default DriverLoginPage;
 