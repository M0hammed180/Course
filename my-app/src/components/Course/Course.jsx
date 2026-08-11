import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [levels, setLevels] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/course/${id}`);
        setCourse(response.data.course);
        setLevels(response.data.levels || []);

        if (response.data.levels?.length > 0) {
          setSelected(response.data.levels[0]);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const progress =
    levels.length > 0 && selected?.level
      ? (selected.level / levels.length) * 100
      : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-700 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          Loading course details...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-700 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          Course not found.
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Comprehensive course
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                {course.name}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {course.description}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
              <div className="flex items-center justify-between gap-6">
                <span>{course.levels} levels</span>
                <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                  Start now
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Progress
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {selected?.level ?? 0}/{levels.length}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="p-4 sm:p-6">
              <div className="mx-auto max-w-3xl rounded-[24px] border border-slate-200 bg-slate-950 p-2 shadow-inner dark:border-slate-800">
                <div className="overflow-hidden rounded-[20px] bg-black">
                  <video
                    key={selected?._id}
                    controls
                    className="aspect-video w-full object-cover"
                  >
                    <source
                      src={`http://localhost:3000/${selected?.video}`}
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/70">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    {selected?.title}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {selected?.duration}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-slate-800 dark:text-white">
                  {selected?.description || "Select a level to start"}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  In this level, you will learn practical fundamentals through
                  direct examples and real applications to help you understand
                  the content more deeply.
                </p>
              </div>
            </div>
          </div>

          <aside className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Course content
              </h3>
            </div>

            <div className="flex-1 space-y-2 p-3">
              {levels.length > 0 ? (
                levels.map((level) => (
                  <button
                    key={level._id}
                    onClick={() => !level.locked && setSelected(level)}
                    className={`w-full rounded-2xl border p-4 text-right transition-all duration-200 ${
                      selected?._id === level._id
                        ? "border-indigo-500 bg-indigo-600 shadow-lg shadow-indigo-900/20"
                        : level.locked
                          ? "cursor-not-allowed border-slate-200 bg-slate-100/70 opacity-60 dark:border-slate-700 dark:bg-slate-800/50"
                          : "cursor-pointer border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-slate-600 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                              selected?._id === level._id
                                ? "bg-white text-indigo-600"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {level.level}
                          </span>
                          <span
                            className={`text-sm font-semibold ${
                              selected?._id === level._id
                                ? "text-white"
                                : "text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {level.title}
                          </span>
                        </div>
                        <p
                          className={`mt-2 text-xs leading-6 ${
                            selected?._id === level._id
                              ? "text-indigo-100"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {level.description}
                        </p>
                      </div>

                      <div>
                        {level.locked ? (
                          <svg
                            className="h-4 w-4 text-slate-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2-2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className={`h-4 w-4 ${
                              selected?._id === level._id
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
                  No levels available for this course yet.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
