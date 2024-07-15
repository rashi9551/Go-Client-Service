import {  useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {axiosAdmin} from '../../../service/axios/axiosAdmin'
import {toast} from 'sonner' ;
import { feedback } from "../../../utils/interfaces";

const VerifiedReports = () => {
    const { id } = useParams();
    const [reports, setReports] = useState<feedback[]>([])

    const getData = async () => {
        try {
            const { data } = await axiosAdmin().get(`driverData?id=${id}`)
            setReports(data.reports)
        } catch (error) {
            toast.error((error as Error).message)
            console.log(error);
        }
    }

    useEffect(() => {
        getData()
    }, [])
    
  return (
    <>
    <div className='bg-gray-100 w-[96%] mx-auto h-fit py-5 rounded-2xl drop-shadow-2xl md:flex items-center px-5'>
                <div className='w-full md:h-fit h-fit grid grid-cols-3 gap-4'>
                    {reports.map((reports: feedback) => {
                        return (
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-red-400">"{reports.reason}"</h2>
                                    <div className="w-full text-right">
                                        <p>{reports.formattedDate}</p>
                                    </div>
                                    <div className="w-full text-right">
                                        <span className="font-bold"> Ride Id:</span>
                                        <span >{reports.ride_id}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
    </>
  )
}

export default VerifiedReports