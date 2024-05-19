import { createSlice } from "@reduxjs/toolkit";

const initialState={
    name:"",
    adminToken:null,
    loggedIn:false
}

const adminAuthSlice=createSlice({
    name:"adminAuth",
    initialState,
    reducers:{
        adminLogin:((state,action)=>{
            state.name=action.payload.name,
            state.adminToken=action.payload.adminToken,
            state.loggedIn=true
        }),
        adminLgout:((state)=>{
            state.name="",
            state.adminToken=null,
            state.loggedIn=false
        })
    }

})

export const {adminLogin,adminLgout}=adminAuthSlice.actions

export default adminAuthSlice