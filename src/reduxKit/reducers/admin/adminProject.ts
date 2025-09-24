/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { adminAddProjectAction } from "../../actions/admin/projectActions";

export interface CourseState {
  courseData: any | null;
  error: string | null;
  loading: boolean;
  courses: any[];
  message: string | null;
}

const initialState: CourseState = {
  courseData: null,
  error: null,
  loading: false,
  courses: [],
  message: null,
};

export const projectSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    updateError: (state, { payload }) => {
      state.error = payload;
    },
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
    resetCourseState: (state) => {
      state.courseData = null;
      state.error = null;
      state.loading = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminAddProjectAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(adminAddProjectAction.fulfilled, (state, { payload }) => {
        console.log("Course creation payload:", payload);
        state.loading = false;
        state.error = null;
        state.courseData = payload;
        state.message = "Course created successfully!";
        // Add the new course to courses array if it exists
        if (payload && payload.course) {
          state.courses.push(payload.course);
        }
      })
      .addCase(adminAddProjectAction.rejected, (state, { payload }) => {
        state.loading = false;
        state.courseData = null;
        state.error = payload as string;
        state.message = null;
      });
  },
});

export const { updateError, clearMessage, resetCourseState } = projectSlice.actions;
export default projectSlice;