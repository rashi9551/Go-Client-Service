/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosAdmin } from "../../../service/axios/axiosAdmin";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function VerifiedDriver() {
  const [driversData, setdriverData] = useState([]);
  const navigate = useNavigate();

  const { adminToken } = useSelector((store: {admin:{adminToken:string}}) => store.admin);  
  const verifiedDriverGet = async () => {
    try {
      const { data } = await axiosAdmin(adminToken).get("verifiedDrivers");
      setdriverData(data);
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };
  useEffect(() => {
    verifiedDriverGet();
  },[]);

  return (
    <>
    <div className="overflow-x-auto">
        <table className="table-auto w-full text-left whitespace-no-wrap">
            {/* head */}
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2">NO</th>
                    <th className="px-4 py-2">NAME</th>
                    <th className="px-4 py-2">MOBILE</th>
                    <th className="px-4 py-2">EMAIL</th>
                    <th className="px-4 py-2">MORE</th>
                </tr>
            </thead>
            <tbody>
                {/* row 1 */}
                {driversData.map((drivers: any, index) => {
                    return (
                        <tr key={index + 1} className="bg-white border-b">
                            <th className="px-4 py-2">{index + 1}</th>
                            <td className="px-4 py-2">
                                <div className="flex items-center space-x-4">
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img
                                                src={drivers.driverImage}
                                                alt="Driver Avatar"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold">{drivers.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-2">{drivers.mobile}</td>
                            <td className="px-4 py-2">{drivers.email}</td>
                            <th className="px-4 py-2">
                                <button
                                    onClick={() => navigate('/admin/verifiedDriver/'+drivers._id)}
                                    className="btn btn-xs bg-white text-black hover:bg-blue-600 relative right-2 rounded-full px-4 py-2 transition-colors duration-300"
                                >
                                    MORE DETAILS
                                </button>
                            </th>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
</>
  );
}

export default VerifiedDriver;
