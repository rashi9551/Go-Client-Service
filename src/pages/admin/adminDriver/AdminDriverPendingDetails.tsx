import { AdminNavbar } from "../../../components/admin/AdminNavbar"
import PendingDetails from "../../../components/admin/Driver/PendingDetails"

function AdminDriverPendingDetails() {
  return (
    <div>
      <AdminNavbar/>
      <div className="admin-container rounded-3xl bg-gray-100 drop-shadow-xl md:mx-[8rem] mt-[2.5rem] pt-1">
        <PendingDetails />
     </div>
    </div>
  )
}

export default AdminDriverPendingDetails
