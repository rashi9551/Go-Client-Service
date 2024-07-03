/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useDispatch } from "react-redux";
import { userLogout } from "../redux/slices/userAuthSlice";

const createAxios=(token:string | null)=>{
    const axiosRide=axios.create({
        baseURL:`${import.meta.env.VITE_API_GATEWAY_URL}/ride`,
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
        async (error) => {
            console.log(error);
            
            const originalRequest = error.config;
            
            if (error.response.status === 401 && !originalRequest._retry) {    
                originalRequest._retry = true;
                const refreshToken = localStorage.getItem('refreshToken');
                console.log("refresh token",refreshToken);
                if (!refreshToken) {
                    localStorage.removeItem('userToken');
                    const dispatch=useDispatch()
                    dispatch(userLogout())
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
    
                try {
                    const response = await axios.post(`http://localhost:3000/api/auth/refresh`, { token: refreshToken });
                    console.log(response,"refresh responbseeyyy");
                    
                    const newAccessToken = response.data.token;
                    const newRefreshToken = response.data.refreshToken;
    
                    localStorage.setItem('userToken', newAccessToken);
                    if (newRefreshToken) {
                        localStorage.setItem('refreshToken', newRefreshToken);
                    }
    
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    axiosRide.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosRide(originalRequest);
                } catch (refreshError) {
                    console.log(refreshError)
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('refreshToken');
                    const dispatch=useDispatch()
                    dispatch(userLogout())
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
    
            return Promise.reject(error);
        })
    return axiosRide;
}

export default createAxios