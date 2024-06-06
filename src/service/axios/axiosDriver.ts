/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const createAxios=()=>{
    const axiosDriver=axios.create({
        baseURL:"http://localhost:3000/api/driver",
        headers:{
            "Content-Type":"application/json"
        }
    });
    axiosDriver.interceptors.request.use(
        (config: any) => {
            const token = localStorage.getItem("driverToken")
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