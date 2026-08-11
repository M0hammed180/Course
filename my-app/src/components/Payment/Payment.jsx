import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Payment() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId, userName, email, phone } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/course/${courseId}`,
        );
        setCourse(response.data.course);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <div className="pt-24 text-center text-2xl">
        Loading Course Details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-24 text-center text-2xl text-red-500">
        Course not found!
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/payment/${courseId}/${userId}`,
      );
      console.log("Success:", response.data.message);
      navigate(`/course/${courseId}`);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error);
        alert(error.response.data.error);
      } else {
        console.error("Network Error:", error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-24 dark:bg-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
            Your Profile
          </p>
          <h2 className="mt-3 text-2xl font-bold">Checkout Details</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Name</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
                {userName}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Email</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
                {email}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Phone</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
                {phone}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <img
            src={`http://localhost:3000/${course.photo}`}
            alt="course"
            className="h-56 w-full object-cover"
          />
          <div className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
              Selected Course
            </p>
            <h3 className="mt-2 text-2xl font-bold">{course.name}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {course.levels} Level
            </p>
            <p className="mt-4 text-lg font-semibold text-cyan-600">
              {course.price} EGP
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {course.description}
            </p>
            <button
              onClick={handlePayment}
              className="mt-6 w-full rounded-2xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700"
            >
              Complete Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
