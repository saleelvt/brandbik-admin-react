/* eslint-disable @typescript-eslint/no-explicit-any */
import axios  from "axios";
import { URL,config ,createAxiosConfig} from "../../../config/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const axiosIn = axios.create({
    baseURL: URL,
  });


  export const adminAddProjectAction= createAsyncThunk(
    "admin/Project",
    async (Datas:FormData,{rejectWithValue})=>{
        try {
            console.log("this  for Project ",Datas);
            const response = await axiosIn.post(`/admin/add-project`, Datas,createAxiosConfig(true));
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


    export const adminGetProjects= createAsyncThunk(
      "admin/adminGetProject",
      async (_,{rejectWithValue})=>{
          try {
              const response = await axiosIn.get(`/admin/getProjects`,config);
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
    export const adminGetProjectById= createAsyncThunk(
      "admin/getProjectById",
      async (id:string,{rejectWithValue})=>{
          try {
              const response = await axiosIn.get(`/admin/getProjectByIdAdmin/${id}`,config);
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
    
    export const adminDeleteProjectById= createAsyncThunk(
      "admin/deleteProjectById",
      async (id:string,{rejectWithValue})=>{
          try {
              const response = await axiosIn.delete(`/admin/DeleteProjectByIdAdmin/${id}`,config);
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

    export const adminUpdateProject= createAsyncThunk(
      "admin/adminUpdateProject",
      async ( { id, data }:{ id: any; data: FormData  },{rejectWithValue})=>{
          try {
              const response = await axiosIn.put(`/admin/updateProject/${id}`, data,config);
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
  
  
    
    