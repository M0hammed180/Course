import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import Courses from "./components/Courses/Courses";
import { Provider, useSelector } from "react-redux";
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
import Quiz from "./components/Quiz/Quiz";
import MyAnswers from "./components/MyAnswers/MyAnswers";
import Dashboard from "./components/Teacher/Dashboard";

import "./App.css";
import StudentsProgress from "./components/Teacher/StudentsProgress";
import QuizStudents from "./components/Teacher/QuizStudents";
import MyComments from "./components/Teacher/MyComments";

function AppContent() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  const { role } = useSelector((state) => state.user);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#000000] text-[#E1DCC9]"
          : "bg-[#E1DCC9] text-[#000000]"
      }`}
    >
      <BrowserRouter>
        <ScrollToTop />

        <Navbar
          theme={theme}
          toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        />

        <div className="min-h-screen">
          <Routes>
            <Route
              path="/"
              element={role === "teacher" ? <Dashboard /> : <Home />}
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />

            <Route path="/add" element={<AddCourse />} />
            <Route path="/addlevel/:id" element={<AddLevel />} />
            <Route path="/mycourses" element={<MyCourses />} />
            <Route path="/mycoursedetailes/:id" element={<Levels />} />

            <Route path="/course/:id" element={<Course />} />

            <Route path="/payment/:courseId" element={<Payment />} />

            <Route path="/purchased" element={<Purchased />} />

            <Route path="/editcourse/:id" element={<EditCourse />} />

            <Route path="/editlevel/:id" element={<EditLevel />} />

            <Route path="/edit" element={<EditProfile />} />

            <Route path="/quiz/:id" element={<Quiz />} />

            <Route path="/myanswers/:id" element={<MyAnswers />} />
            <Route path="/myanswers/:id/:userId" element={<MyAnswers />} />

            <Route
              path="/studentsprogress/:courseId"
              element={<StudentsProgress />}
            />
            <Route path="/quizstudents/:quizId" element={<QuizStudents />} />
            <Route path="/mycomments" element={<MyComments />} />
          </Routes>
        </div>

        <Footer theme={theme} />
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <Provider store={reduxstore}>
      <AppContent />
    </Provider>
  );
}

export default App;
