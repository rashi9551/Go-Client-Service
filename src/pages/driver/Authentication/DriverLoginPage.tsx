/* eslint-disable @typescript-eslint/no-explicit-any */
import DriverLogin from "../../../components/driver/Authentication/Login/DriverLogin";
import { useSelector } from "react-redux";
import PendingModal from "../../../components/PendingModal";
import  RejectedModal  from "../../../components/RejectModal";
function DriverLoginPage() {
    const isOpenPending  = useSelector((store: {pendingModal:{isOpenPending:boolean}}) => store.pendingModal.isOpenPending);
    const isOpenRejected  = useSelector((store: {rejectModal:{isOpenRejected:boolean}}) => store.rejectModal.isOpenRejected);
    console.log(isOpenRejected,"chgvhgh");
    
    return (
        <div>
            {isOpenPending && <PendingModal />}
            {isOpenRejected && <RejectedModal/>}
            <DriverLogin />
        </div>
    );
}

export default DriverLoginPage;
 