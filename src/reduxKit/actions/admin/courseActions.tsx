/* eslint-disable @typescript-eslint/no-explicit-any */
import axios  from "axios";
import { URL,config } from "../../../config/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const axiosIn = axios.create({
    baseURL: URL,
  });


  export const adminAddCourseAction= createAsyncThunk(
    "admin/Course",
    async (Datas:FormData,{rejectWithValue})=>{
        try {
            console.log("this  for Course ",Datas);
            const response = await axiosIn.post(`/admin/addCourse`, Datas,config);
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error.response) {
              return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: "Something went wrong!" });
          }
    }
  )


    export const adminGetCourses= createAsyncThunk(
      "admin/adminGetCourse",
      async (_,{rejectWithValue})=>{
          try {
              const response = await axiosIn.get(`/admin/getCourseAdmin`,config);
              return response.data;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
              if (error.response) {
                return rejectWithValue(error.response.data);
              }
              return rejectWithValue({ message: "Something went wrong!" });
            }
      }
    )
    export const adminGetCourseById= createAsyncThunk(
      "admin/getCourseById",
      async (id:string,{rejectWithValue})=>{
          try {
              const response = await axiosIn.get(`/admin/getCourseByIdAdmin/${id}`,config);
              return response.data;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
              if (error.response) {
                return rejectWithValue(error.response.data);
              }
              return rejectWithValue({ message: "Something went wrong!" });
            }
      }
    ) 
    export const adminCourseChangeStatus= createAsyncThunk(
      "admin/adminCourseChangeStatus", 
      async (id:string,{rejectWithValue})=>{
          try {
              const response = await axiosIn.patch(`/admin/status/${id}`,config);
              return response.data;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
              if (error.response) {
                return rejectWithValue(error.response.data);
              }
              return rejectWithValue({ message: "Something went wrong!" });
            }
      }
    )
    export const adminUpdateCourse= createAsyncThunk(
      "admin/adminUpdateCourse",
      async ( { id, data }:{ id: any; data: FormData  },{rejectWithValue})=>{
          try {
              const response = await axiosIn.put(`/admin/updateCourse/${id}`, data,config);
              return response.data; 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
              if (error.response) {
                return rejectWithValue(error.response.data);
              }
              return rejectWithValue({ message: "Something went wrong!" });
            }
      }
    )
  
  
    
    