import UserDetails from "../../../components/admin/User/UserDetail";
import { AdminNavbar } from "../../../components/admin/AdminNavbar";

const AdminUserDetails = () => {
    return (
        <>
            <AdminNavbar />
            <div className="admin-container drop-shadow-xl">
                <UserDetails />
            </div>
        </>
    );
};

export default AdminUserDetails;
