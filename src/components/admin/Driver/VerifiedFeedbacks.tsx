import {  useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {axiosAdmin} from '../../../service/axios/axiosAdmin'
import toast from 'react-hot-toast';
import { feedback } from "../../../utils/interfaces";
import StarRating from "../../StarRating";

const VerifiedFeedbacks = () => {
    const { id } = useParams();
    const [feedbacks, setfeedbacks] = useState<feedback[]>([])

    const getData = async () => {
        try {
            const { data } = await axiosAdmin().get(`driverData?id=${id}`)
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
                <div className='w-full md:h-fit h-fit grid grid-cols-3 gap-4'>
                    {feedbacks.map((feedbacks: feedback) => {
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
                    })}

                </div>
            </div>
    </>
  )
}

export default VerifiedFeedbacks