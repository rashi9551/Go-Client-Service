/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const createAxios=(userToken:string)=>{
    const axiosUser=axios.create({
        baseURL:"http://localhost:3001/users",
        headers:{
            "Content-Type":"application/json"
        }
    });
    axiosUser.interceptors.request.use(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (config: any) => {
            const token = userToken;
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