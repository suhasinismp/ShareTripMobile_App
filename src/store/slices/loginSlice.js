import { createSlice } from "@reduxjs/toolkit";
import { set } from "lodash";



const loginSlice=createSlice({
    name:'userInfo',
    initialState:{
        meta:{
            isLoading:false
        },
        userId:null,
        userName:"",
        userEmail:"",
        userRole:null,
        userMobile:"",
        userToken:"",


    },
    reducers:{
     setUserDataToStore:(state, action)=>{

        if(action.payload.userId){
            set(state, 'userId', action.payload.userId)
        }
       if(action.payload.userName){
        set(state, 'userName',action.payload.userName)
       }
       if(action.payload.userEmail){
        set(state,'userEmail', action.payload.userEmail )
       }
       if(action.payload.userRole){
        set(state,'userRole',action.payload.userRole)
       }
       if(action.payload.userMobile){
        set(state,'userMobile',action.payload.userMobile)
       }
       if(action.payload.userToken){
        set(state,'userToken',action.payload.userToken )
       }
    }

    }
})
export const{setUserDataToStore}=loginSlice.actions
export default loginSlice.reducer