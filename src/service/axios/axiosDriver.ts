/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const createAxios=(driverToken:string)=>{
    const axiosDriver=axios.create({
        baseURL:"http://localhost:3002/driver",
        headers:{
            "Content-Type":"application/json"
        }
    });
    axiosDriver.interceptors.request.use(
        (config: any) => {
            const token = driverToken
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

    axiosDriver.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return axiosDriver;
}

export default createAxios