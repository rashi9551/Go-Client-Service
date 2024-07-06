import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {axiosAdmin} from '../../../service/axios/axiosAdmin'
import {toast} from 'sonner' ;import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog } from "@material-tailwind/react";
import { UserInterface } from "../../../utils/interfaces";


const UserDetails = () => {


    const [statusModal, setstatusModal] = useState(false);

    const [userData, setuserData] = useState<UserInterface | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();


    const getData = async () => {
        try {
            const { data } = await axiosAdmin().get(`userData?id=${id}`);
            setuserData(data);
        } catch (error) {
            toast.error((error as Error).message)
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

   

    const formikStatus = useFormik({
        initialValues: {
            reason: "",
            status: "",
        },
        validationSchema: Yup.object({
            reason: Yup.string().required("Please provide a valid reason!").min(5, "Enter a valid reason"),
            status: Yup.string().required("Please select the status"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const { data } = await axiosAdmin().post(`updateUserStatus?id=${id}`, values);
                if (data.message === "Success") {
                    setstatusModal(false);
                    toast.success("Status updated successfully!");
                    navigate("/admin/users");
                } else {
                    toast.error("Something internal error");
                }
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <>
            {statusModal && (
                <Dialog open={statusModal} handler={formikStatus.handleSubmit} className='bg-transparent' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <div className="w-full h-full relative flex justify-center">
                    <div
                        className="fixed inset-0 z-10 overflow-y-auto"
                        aria-labelledby="modal-title"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                                &#8203;
                            </span>

                            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-righ  sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
                                <div>
                                    <div className="mt-2 text-center">
                                        <h1 className="text-xl font-bold">
                                            Are you sure want to change the
                                            <br /> status of this user?
                                        </h1>

                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Make sure you double checked and validated all the <br /> stats of the user so
                                            far.
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={formikStatus.handleSubmit}>
                                    <div className="mt-2 -mx-1 text-center">
                                        <div>
                                            <select
                                                name="status"
                                                onChange={formikStatus.handleChange}
                                                onBlur={formikStatus.handleBlur}
                                                className="select select-info select-sm w-full max-w-xs"
                                            >
                                                <option disabled selected>
                                                    Select the updated status
                                                </option>
                                                <option>Block</option>
                                                <option>Good</option>
                                            </select>
                                        </div>
                                        <div className="text-center mt-1 text-red-500">
                                            <p className="text-xs">
                                                {formikStatus.touched.status && formikStatus.errors.status}
                                            </p>
                                        </div>
                                        <h1 className="mx-1 text-sm mt-4 mb-2">Please provide the reason.</h1>
                                        <textarea
                                            name="reason"
                                            onBlur={formikStatus.handleBlur}
                                            onChange={formikStatus.handleChange}
                                            className="flex-1 block h-10 w-full px-3 py-2 mx-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
                                        />
                                        <div className="text-center mt-1 text-red-500">
                                            <p className="text-xs">
                                                {formikStatus.touched.reason && formikStatus.errors.reason}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 sm:flex sm:items-center sm:justify-center">
                                        <div className="sm:flex sm:items-center ">
                                            <button
                                                onClick={() => setstatusModal(false)}
                                                className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-blue-600 capitalize transition-colors duration-300 transform  rounded-md sm:w-auto sm:mt-0  focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity- "
                                            >
                                                DISMISS
                                            </button>
                                            <button
                                                type="submit"
                                                className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:w-auto sm:mt-0 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                            >
                                                UPDATE STATUS
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                </Dialog>
            )}

            <div className="h-screen">
                <h1 className="mx-[7.8rem] mt-10 text-3xl font-bold text-black">User Details</h1>
                <div className="grid md:grid-cols-2 sm:grid-cols-2 gap-4 mt-7 md:px-28 w-full h-full  rounded-3xl">
                    <div className=" ml-4 my-4 rounded-3xl px-3 pt-3 pb-4 h-5/6">
                        <div className="w-full h-3/6 bg-white drop-shadow-2xl rounded-3xl mb-3 overflow-hidden">
                            <img className="w-full" src={userData?.userImage} alt="" />
                        </div>

                        <div className="w-full md:h-52 h-3/6 bg-white rounded-3xl drop-shadow-2xl ">
                            <div className="text-center px-3 py-4 text-2xl font-bold">
                                <h1>{userData?.name}</h1>
                            </div>
                            <div className="md:flex justify-evenly">
                                <div className="flex">
                                    <button className="btn btn-active font-bold btn-neutral btn-xs mx-2">Email :</button>
                                    <h1>{userData?.email}</h1>
                                </div>
                                <div className="flex">
                                    <button className="btn btn-active font-bold btn-neutral btn-xs mx-2">Mobile</button>
                                    <h1>{userData?.mobile}</h1>
                                </div>
                            </div>
                            <div className="md:flex justify-center items-center h-2/5">
                                    <button
                                        onClick={() => setstatusModal(true)}
                                        className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:w-auto sm:mt-0 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                    >
                                        UPDATE ACCOUNT STATUS
                                    </button>
                                </div>
                        </div>
                    </div>
                    <div className=" mx-4 my-4 rounded-3xl px-3 py-4 h-5/6">
                        <div className="w-full h-16 bg-indigo-400 mb-3 rounded-3xl overflow-hidden drop-shadow-2xl">
                            <div className="flex justify-center items-center h-full w-full">
                                <h1 className="font-bold mr-3 text-white">
                                    ACCOUNT STATUS
                                </h1>
                                {userData?.accountStatus === "Good" &&
                                    <h1 className="btn btn-sm btn-success text-white">{userData?.accountStatus}</h1>
                                }
                                {userData?.accountStatus === "Blocked" &&
                                    <h1 className="btn btn-sm btn-error text-white">{userData?.accountStatus}</h1>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDetails;
