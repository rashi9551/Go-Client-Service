/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const createAxios=()=>{
    const axiosUser=axios.create({
        baseURL:"http://localhost:3000/api/user",
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
    });
    axiosUser.interceptors.request.use(
        (config: any) => {
            const token = localStorage.getItem('userToken');
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

    axiosUser.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return axiosUser;
}

export default createAxios