import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Loading from "../Elements/Loading";
import { FiEdit, FiTrash } from "react-icons/fi";

export default function MyCourses() {
  const id = useSelector((state) => state.user.userId);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/course/mycourses/${id}`,
      );
      setCourse(response.data.course);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const deleteCourse = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:3000/course/${id}`);
      console.log({
        succses: response.data.succses,
        message: response.data.message,
      });
      fetchCourseDetails();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
            Teacher Area
          </p>
          <h2 className="text-3xl font-bold">My Courses</h2>
        </div>
        <div className="flex justify-center items-center flex-wrap">
          {course.map((c) => (
            <div
              key={c._id}
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
                {/* <p className="mb-2 text-slate-500 dark:text-slate-400">
                    {c.levels} Level
                  </p> */}
                <h4 className=" font-bold text-cyan-600">{c.price} EGP</h4>
                {/* <p className="mb-4 text-slate-500 dark:text-slate-400">
                    {c.description}
                  </p> */}
              </div>

              <Link
                to={`/mycoursedetailes/${c._id}`}
                className="rounded-2xl bg-cyan-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-cyan-700 m-2"
              >
                View Course
              </Link>
              <div className="flex justify-around items-center m-2">
                {" "}
                <Link
                  to={`/editcourse/${c._id}`}
                  className="flex justify-center text-center text-blue-500 rounded-full py-2 px-8 bg-blue-300 "
                >
                  <FiEdit size={25} />
                </Link>
                <button
                  onClick={() => deleteCourse(c._d)}
                  className=" flex justify-center text-center cursor-pointer text-red-500 rounded-full py-2 px-8  bg-red-300 "
                >
                  <FiTrash size={25} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
