import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Loading from "../Elements/Loading";

export default function Purchased() {
  const id = useSelector((state) => state.user.userId);
  const [course, setCourse] = useState(null);
  const [myPayments, setMyPayments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/course/purchasedcourses/${id}`,
        );
        setCourse(response.data.myPayments);
        console.log(response.data.myPayments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="pt-24 text-center text-2xl text-red-500">
        Course not found!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 md:px-6 md:py-24 px-3 py-10  dark:bg-slate-950 ">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 sm:px-8 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
            My Courses
          </p>
          <h2 className="text-3xl font-bold">Choose your next course</h2>
        </div>
        <div className="flex justify-center items-center flex-wrap">
          {course.map((c) => (
            <Link
              key={c._id}
              to={`/course/${c._id}`}
              className=" md:w-3/12 w-5/12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70 transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none
                flex flex-col justify-center m-2 "
            >
              <img
                src={c.photo}
                alt="course"
                className="md:h-30 h-20 w-full object-cover"
              />

              <div className="p-3 flex justify-between items-center text-xs md:text-lg">
                <p className=" font-semibold uppercase">{c.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
