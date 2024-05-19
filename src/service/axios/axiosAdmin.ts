import axios from "axios";

const createAxios=(adminToken:string)=>{
    const axiosUser=axios.create({
        baseURL:"http://localhost:3002/admin",
        headers:{
            "Content-Type":"application/json"
        }
    });
    console.log(adminToken)
    return axiosUser
}

export default createAxios