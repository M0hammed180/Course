import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import "./App.css";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import Courses from "./components/Courses/Courses";
import { Provider } from "react-redux";
import reduxstore from "./Redux/reduxStore";
import AddCourse from "./components/Teacher/AddCourse";
import MyCourses from "./components/Teacher/MyCourses";
import Levels from "./components/Teacher/Levels";
import AddLevel from "./components/Teacher/AddLevel";
import Course from "./components/Course/Course";
import Payment from "./components/Payment/Payment";
import Purchased from "./components/Purchased/Purchased";
import ScrollToTop from "./components/ScrollToTop";
import EditCourse from "./components/Teacher/EditCourse";
import EditLevel from "./components/Teacher/EditLevel";
import EditProfile from "./components/EditProfile/EditProfile";
function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}
    >
      <Provider store={reduxstore}>
        <BrowserRouter>
          <ScrollToTop />
          <Navbar
            theme={theme}
            toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          />
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/add" element={<AddCourse />} />
              <Route path="/addlevel/:id" element={<AddLevel />} />
              <Route path="/mycourses" element={<MyCourses />} />
              <Route path="/mycoursedetailes/:id" element={<Levels />} />
              <Route path="/course/:id" element={<Course />} />
              <Route path="/payment/:courseId" element={<Payment />} />
              <Route path="/purchased/:id" element={<Purchased />} />
              <Route path="/editcourse/:id" element={<EditCourse />} />
              <Route path="/editlevel/:id" element={<EditLevel />} />
              <Route path="/edit/" element={<EditProfile />} />
            </Routes>
          </div>
          <Footer theme={theme} />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
