import axios from "axios";

const createAxios=(driverToken:string)=>{
    const axiosUser=axios.create({
        baseURL:"http://localhost:3002/driver",
        headers:{
            "Content-Type":"application/json"
        }
    });
    console.log(driverToken)
    return axiosUser
}

export default createAxios