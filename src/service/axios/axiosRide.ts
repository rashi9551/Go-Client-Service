/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const createAxios=(token:string | null)=>{
    const axiosRide=axios.create({
        baseURL:"http://localhost:3000/api/ride",
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
    });
    axiosRide.interceptors.request.use(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (config: any) => {
            return {
                ...config,
                headers: {
                    ...(token !== null && { Authorization: `Bearer ${token}` }),
                    ...config.headers,
                },
            };
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );

    axiosRide.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return axiosRide;
}

export default createAxios