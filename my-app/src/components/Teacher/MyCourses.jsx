import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useSelector } from "react-redux";
import Loading from "../Elements/Loading";
import { FiEdit, FiTrash } from "react-icons/fi";

export default function MyCourses() {
  const id = useSelector((state) => state.user.userId);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/course/mycourses/${id}`);
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
      const response = await api.delete(`/course/${id}`);
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
      <div className="pt-24 text-center text-2xl text-red-500 dark:text-red-400">
        Course not found!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E1DCC9] px-3 py-10 text-[#1F150C] dark:bg-[#1F150C] dark:text-[#E1DCC9] md:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 sm:px-8 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#412D15] dark:text-[#E1DCC9]">
            Teacher Area
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#1F150C] dark:text-[#E1DCC9]">
            My Courses
          </h2>
        </div>

        <div className="flex flex-wrap items-stretch justify-center gap-4">
          {course.map((c) => (
            <div
              key={c._id}
              className="flex w-full max-w-[260px] flex-col overflow-hidden rounded-[1.5rem] border border-[#412D15]/15 bg-[#F8F3EC] shadow-[0_18px_30px_rgba(31,21,12,0.08)] transition hover:-translate-y-1 dark:border-[#E1DCC9]/10 dark:bg-[#20170E]"
            >
              <img
                src={c.photo}
                alt="course"
                className="h-36 w-full object-cover"
              />

              <div className="flex flex-1 flex-col p-3">
                <div className="flex items-start justify-between gap-2 text-xs md:text-base">
                  <p className="font-black uppercase leading-snug text-[#1F150C] dark:text-[#E1DCC9]">
                    {c.name}
                  </p>
                  <h4 className="shrink-0 font-black text-[#412D15] dark:text-[#E1DCC9]">
                    {c.price} EGP
                  </h4>
                </div>

                <Link
                  to={`/mycoursedetailes/${c._id}`}
                  className="mt-4 rounded-2xl bg-[#412D15] px-4 py-3 text-center text-sm font-semibold text-[#E1DCC9] transition hover:bg-[#1F150C] dark:bg-[#E1DCC9] dark:text-[#1F150C] dark:hover:bg-[#F8F3EC]"
                >
                  View Course
                </Link>

                <div className="mt-3 flex items-center justify-around gap-2">
                  <Link
                    to={`/editcourse/${c._id}`}
                    className="flex flex-1 items-center justify-center rounded-full bg-[#E1DCC9] p-2.5 text-[#412D15] transition hover:bg-[#F5F0E8] dark:bg-[#412D15] dark:text-[#E1DCC9] dark:hover:bg-[#2A1D10]"
                  >
                    <FiEdit size={22} />
                  </Link>
                  <button
                    onClick={() => deleteCourse(c._id)}
                    className="flex flex-1 cursor-pointer items-center justify-center rounded-full bg-[#F1D9D9] p-2.5 text-[#8F3E3E] transition hover:bg-[#E9C4C4] dark:bg-[#4A1E1E] dark:text-[#F9C7C7] dark:hover:bg-[#5B2424]"
                  >
                    <FiTrash size={22} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
