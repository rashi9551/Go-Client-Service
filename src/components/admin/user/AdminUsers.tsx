/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { axiosAdminUser } from "../../../service/axios/axiosAdmin";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const AdminUsers = () => {
    const [usersData, setusersData] = useState([]);

    const { adminToken } = useSelector((store: any) => store.admin)

    const getData = async () => {
        try {
            const { data } = await axiosAdminUser(adminToken).get("getUserData");
            setusersData(data);
        } catch (error) {
            toast.error((error as Error).message)
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const blockUser=async (id:string)=>{
        try {
            
             await axiosAdminUser(adminToken).post(`blockUser?id=${id}`);
        } catch (error:any) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getData();
    }, [blockUser]);
    

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
                    <th className="px-4 py-2">STATUS</th>
                </tr>
            </thead>
            <tbody>
                {/* row 1 */}
                {usersData.map((users: any, index) => {
                    return (
                        <tr key={index + 1} className="bg-white border-b">
                            <th className="px-4 py-2">{index + 1}</th>
                            <td className="px-4 py-2">
                                <div className="flex items-center space-x-4">
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img
                                                src={users.driverImage}
                                                alt="Driver Avatar"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold">{users.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-2">{users.mobile}</td>
                            <td className="px-4 py-2">{users.email}</td>
                            <th className="px-4 py-2">
                                <button
                                    onClick={() => blockUser(users._id)}
                                    className="btn btn-xs bg-red-400 text-white hover:bg-red-600 relative right-2 rounded-full px-4 py-2 transition-colors duration-300"
                                >
                                    Block
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
};

export default AdminUsers;