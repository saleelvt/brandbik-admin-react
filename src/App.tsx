import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { useSelector } from "react-redux";
import { RootState } from "./reduxKit/store";
import { Toaster } from 'react-hot-toast';


import AddCourse from "./pages/course/AddCourse";

import SignIn from "./pages/AuthPages/SignIn";

import UpdateCourse from "./pages/course/updateCourse";
 

import NotFound from "./pages/OtherPage/NotFound";
import CoursesList from "./pages/course/CoursesList";


export const App: React.FC = React.memo(() => {
  const { isLogged, role } = useSelector((state: RootState) => state.auth);
  console.log("Logged & Role:-", isLogged, role); 

  return (
    <Router>
      <ScrollToTop />
         <Toaster position="top-center" />


      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<SignIn />} />

        {/* Protected Routes inside AppLayout */}
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={isLogged ? <CoursesList /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-Work"
            element={isLogged ? <AddCourse /> : <Navigate to="/login" />}
          />
        
          <Route
            path="/works-list"
            element={isLogged ? <CoursesList /> : <Navigate to="/login" />}
          /> 
          <Route
            path="/updateWork"
            element={isLogged ? <UpdateCourse /> : <Navigate to="/login" />}
          />
        
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
});

export default App;
