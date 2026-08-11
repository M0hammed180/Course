import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export default function MyCourses() {
  const id = useSelector((state) => state.user.userId);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/mycourses/${id}`,
        );
        setCourse(response.data.course);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

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

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-24 dark:bg-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
            Teacher Area
          </p>
          <h2 className="text-3xl font-bold">My Courses</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {course.map((c) => (
            <div
              key={c._id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70 transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              <img
                src={`http://localhost:3000/${c.photo}`}
                alt="course"
                className="h-44 w-full object-cover"
              />
              <div className="flex flex-col p-5">
                <p className="mb-2 text-lg font-semibold uppercase">{c.name}</p>
                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                  {c.levels} Level
                </p>
                <h4 className="mb-3 text-xl font-bold text-cyan-600">
                  {c.price} EGP
                </h4>
                <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                  {c.description}
                </p>
                <Link
                  to={`/mycoursedetailes/${c._id}`}
                  className="rounded-2xl bg-cyan-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-cyan-700"
                >
                  Show My Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
