/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { Input } from "@material-tailwind/react";
import { useFormik } from 'formik';
import * as Yup from 'yup'
import toast from 'react-hot-toast';
import axiosUser from '../../../service/axios/axiosUser'; 

const ProfileInfo = () => {

    const {user_id} = useSelector((store: any) => store.user)
    const [userData, setuserData] = useState<any | {}>({})

    console.log(userData);
    const getData = async () => {
        try {
            const { data } = await axiosUser().get(`userData?id=${user_id}`)
            
            setuserData(data)
        } catch (error) {
            toast.error((error as Error).message)
            console.log(error);
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const [editProfile, seteditProfile] = useState(false)
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            mobile: ""
        },
        validationSchema: Yup.object({
            name: Yup.string().min(3, "Type a valid name"),
            email: Yup.string().email("Please enter a valid email"),
            mobile: Yup.string().length(10, "Please enter a valid number"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const { data } = await axiosUser().post(`profileUpdate?user_id=${user_id}`, values)
                if (data.message === "Success") {
                    console.log(data);
                    setuserData(data.newData)
                    seteditProfile(false)
                    toast.success("Profile updated successfully!")
                }
            } catch (error) {
                toast.error((error as Error).message);
                console.log(error);
            } finally {
                setSubmitting(false)
            }
        }
    })

    return (
        <>
            <div className='bg-white w-[96%] mx-auto h-fit rounded-2xl drop-shadow-xl md:flex items-center px-5'>
                <div className='md:w-1/3 md:h-96 h-80'>
                    <div className='h-full flex flex-col gap-1 justify-center items-center'>
                        <div className="avatar">
                        <div className="w-40 h-40 rounded-full overflow-hidden drop-shadow-xl">
                            <img src={userData?.userImage} className="w-full h-full object-cover" alt="User" />
                        </div>
                        </div>
                        <div>
                            <h1 className='text-xl font-semibold'>
                                {userData?.name}
                            </h1>
                        </div>
                    </div>
                </div>
                <div className='md:w-2/3 h-full py-8 pr-7'>
                    {!editProfile ? (
                        <div className='flex flex-col w-full h-full gap-4'>
                            <div className='w-full flex gap-6 -mb-3'>
                                <p className='w-1/2'>Name</p>
                                <p className='w-1/2 hidden md:block'>Mobile</p>
                            </div>
                            <div className='md:flex gap-6'>
                                <Input label={userData?.name} disabled crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                <p className='w-1/2 md:hidden'>Mobile</p>
                                <Input label={userData && userData.mobile ? userData.mobile.toString() : ''} disabled crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                            <div className='w-full flex gap-6 -mb-3'>
                                <p className='w-1/2'>Email</p>
                                <p className='w-1/2 hidden md:block'>Referral Code</p>
                            </div>
                            <div className='md:flex gap-6'>
                                <Input label={userData?.email} disabled crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                <p className='w-1/2 md:hidden'>Refferl Code</p>
                                <Input label={userData?.referralCode} disabled crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                            <div className='w-full flex gap-6 -mb-3'>
                                <p className='w-1/2'>Account Status</p>
                                <p className='w-1/2 hidden md:block'>Joining Date</p>
                            </div>
                            <div className='md:flex gap-6 overflow-hidden'>
                                <Input label={userData?.accountStatus} disabled crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                <p className='w-1/2 md:hidden'>Joining Date</p>
                                <Input className='' label={userData?.formattedDate} disabled crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                            <div className=''>
                                <button
                                    onClick={() => seteditProfile(true)}
                                    className='btn btn-sm  bg-blue-400  text-white font-semibold hover:bg-blue-600 relative right-2 rounded-full px-4 py-2 transition-colors duration-300'>EDIT PROFILE</button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={formik.handleSubmit} className='flex flex-col w-full h-full gap-4'>
                            <div className='w-full flex gap-6 -mb-3'>
                                <p className='w-1/2'>Name</p>
                                <p className='w-1/2 hidden md:block'>Mobile</p>
                            </div>
                            <div className='md:flex gap-6'>
                                <input name='name' onChange={formik.handleChange} type="text" placeholder={userData?.name} className="input input-bordered input-sm py-[1.16rem] w-full max-w-[21.5rem]" />
                                <p className='w-1/2 md:hidden'>Mobile</p>
                                <input name='mobile' onChange={formik.handleChange} type="number" placeholder={userData?.mobile} className="input input-bordered input-sm py-[1.16rem] w-full max-w-[21.5rem]" />
                            </div>
                            <div className='w-full flex gap-6 -mb-3'>
                                <p className='w-1/2'>Email</p>
                                <p className='w-1/2 hidden md:block'>Referral Code</p>
                            </div>
                            <div className='md:flex gap-6'>
                                <input name='email' onChange={formik.handleChange} type="text" placeholder={userData?.email} className="input input-bordered input-sm py-[1.16rem] w-full max-w-[21.5rem]" />
                                <p className='w-1/2 md:hidden'>Refferl Code</p>
                                <Input label={userData?.referral_code} disabled crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                            <div className='w-full flex gap-6 -mb-3'>
                                <p className='w-1/2'>Account Status</p>
                                <p className='w-1/2 hidden md:block'>Joining Date</p>
                            </div>
                            <div className='md:flex gap-6'>
                                <Input label={userData?.account_status} disabled crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                <p className='w-1/2 md:hidden'>Joining Date</p>
                                <Input label={userData?.joiningDate} disabled crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                            <div className='flex gap-3'>
                                <button
                                    type='submit'
                                    className='w-[20%] h-10 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300'>  SAVE CHANGES  </button>
                                <button
                                    onClick={() => seteditProfile(false)}
                                    className='btn btn-xs bg-red-400 text-white hover:bg-red-600 relative right-2 rounded-full px-4 py-2 transition-colors duration-300'>CANCEL</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfileInfo;
