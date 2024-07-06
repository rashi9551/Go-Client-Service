import axiosDriver from '../../../service/axios/axiosDriver';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {toast} from 'sonner' ;
import { feedback } from '../../../utils/interfaces';
import StarRating from '../../StarRating';


const DriverFeedbacks = () => {

    const {driverId} = useSelector((store: {driver:{driverId:string}}) => store.driver)

    const [feedbacks, setfeedbacks] = useState<feedback[]>([])

    
    const getData = async () => {
        try {
            const { data } = await axiosDriver().get(`driverData?driver_id=${driverId}`) 

            setfeedbacks(data.formattedFeedbacks)
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
                <div className='w-full md:h-fit h-fit md:grid grid-cols-3 gap-4'>
                    {(feedbacks.map((feedbacks: feedback) => {
                        console.log(feedbacks,"asfadsf");
                        
                        return (
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">"{feedbacks.feedback}"</h2>
                                    <div className="card-actions mt-1 ml-2">
                                        <div className="rating gap-1">
                                        <StarRating totalStars={5} initialRating={feedbacks.rating} onStarClick={()=>{}} />
                                        </div>
                                    </div>
                                    <div className="w-full text-right">
                                        <p>{feedbacks.formattedDate}</p>
                                    </div>
                                    <div className="w-full text-right">
                                        <span className="font-bold"> Ride Id:</span>
                                        <span >{feedbacks.ride_id}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }))}

                </div>
            </div>
        </>
    )
}

export default DriverFeedbacks