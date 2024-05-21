import axios from "axios";

export const axiosAdminUser=(adminToken:string)=>{
    const axiosAdmin=axios.create({
        baseURL:"http://localhost:3001/admin",
        headers:{
            "Content-Type":"application/json"
        }
    });
    axiosAdmin.interceptors.request.use(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (config: any) => {
            const token = adminToken
            return {
                ...config,
                headers: {
                    ...(token !== null && { Authorization: `Bearer ${token}` }),
                    ...config.headers,
                },
            };
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error: any) => {
            return Promise.reject(error);
        }
    );

    axiosAdmin.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return axiosAdmin
}
export const axiosAdminDriver=(adminToken:string)=>{
    const axiosAdmin=axios.create({
        baseURL:"http://localhost:3002/admin",
        headers:{
            "Content-Type":"application/json"
        }
    });
    axiosAdmin.interceptors.request.use(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (config: any) => {
            const token = adminToken
            return {
                ...config,
                headers: {
                    ...(token !== null && { Authorization: `Bearer ${token}` }),
                    ...config.headers,
                },
            };
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error: any) => {
            return Promise.reject(error);
        }
    );

    axiosAdmin.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return axiosAdmin
}

