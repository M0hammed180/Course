import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { FiUsers, FiLayers, FiArrowRight, FiSearch } from "react-icons/fi";
import Loading from "../Elements/Loading";

export default function StudentInCourse() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/progress/mystudentinmycourse/${courseId}`,
      );

      setCourse(response.data.myAllStudents);
    } catch (error) {
      console.error("Error fetching course students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchStudents();
    }
  }, [courseId]);

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#E1DCC9] text-[#1F150C] dark:bg-[#1F150C] dark:text-[#E1DCC9]"
        dir="rtl"
      >
        <p className="text-[#412D15] dark:text-[#E1DCC9]">Course not found</p>
      </div>
    );
  }

  const filteredStudents = course.students.filter((student) => {
    const value = search.toLowerCase();

    return (
      student.name?.toLowerCase().includes(value) ||
      student.username?.toLowerCase().includes(value)
    );
  });

  return (
    <div
      className="min-h-screen bg-[#E1DCC9] p-5 text-[#1F150C] dark:bg-[#1F150C] dark:text-[#E1DCC9] md:p-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#412D15] transition hover:text-[#1F150C] dark:text-[#E1DCC9]/80 dark:hover:text-[#E1DCC9]"
          >
            <FiArrowRight />
            Back
          </button>

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#000000] dark:text-[#E1DCC9]">
                {course.courseName}
              </h1>

              <p className="mt-2 text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                Students enrolled in this course
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-[#412D15]/15 bg-[#F8F3EC] px-5 py-4 shadow-sm dark:border-[#E1DCC9]/10 dark:bg-[#20170E]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E1DCC9] text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                  <FiUsers />
                </div>

                <div>
                  <p className="text-xs text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                    Students
                  </p>

                  <p className="text-xl font-bold text-[#000000] dark:text-[#E1DCC9]">
                    {course.numberOfStudents}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#412D15]/15 bg-[#F8F3EC] px-5 py-4 shadow-sm dark:border-[#E1DCC9]/10 dark:bg-[#20170E]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E1DCC9] text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                  <FiLayers />
                </div>

                <div>
                  <p className="text-xs text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                    Levels
                  </p>

                  <p className="text-xl font-bold text-[#000000] dark:text-[#E1DCC9]">
                    {course.students[0]?.courseLevels || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#412D15]/60 dark:text-[#E1DCC9]/70" />

            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-[#412D15]/15 bg-[#F8F3EC] py-3 pr-11 pl-4 text-sm text-[#1F150C] outline-none transition placeholder:text-[#412D15]/60 focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#20170E] dark:text-[#E1DCC9] dark:placeholder:text-[#E1DCC9]/60 dark:focus:border-[#E1DCC9]"
            />
          </div>
        </div>

        {/* Students */}
        <div className="rounded-3xl border border-[#412D15]/15 bg-[#F8F3EC] shadow-sm dark:border-[#E1DCC9]/10 dark:bg-[#20170E]">
          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#412D15]/15 text-right text-sm text-[#412D15]/75 dark:border-[#E1DCC9]/10 dark:text-[#E1DCC9]/75">
                  <th className="px-6 py-5 font-medium">Student</th>

                  <th className="px-6 py-5 font-medium">Progress</th>

                  <th className="px-6 py-5 font-medium">Completed</th>

                  <th className="px-6 py-5 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => {
                  const progress =
                    student.courseLevels > 0
                      ? Math.round(
                          (student.completedLevels / student.courseLevels) *
                            100,
                        )
                      : 0;

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-[#412D15]/10 transition hover:bg-[#F3EBDD] last:border-0 dark:border-[#E1DCC9]/10 dark:hover:bg-[#2A1D10]"
                    >
                      {/* Student */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="h-11 w-11 rounded-full object-cover"
                          />

                          <div>
                            <p className="font-bold text-[#000000] dark:text-[#E1DCC9]">
                              {student.name}
                            </p>

                            <p className="mt-1 text-xs text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                              {student.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="min-w-64 px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E1DCC9] dark:bg-[#412D15]/50">
                            <div
                              className="h-full rounded-full bg-[#412D15] transition-all duration-500 dark:bg-[#E1DCC9]"
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>

                          <span className="w-10 text-left text-sm font-bold text-[#412D15] dark:text-[#E1DCC9]">
                            {progress}%
                          </span>
                        </div>
                      </td>

                      {/* Completed */}
                      <td className="px-6 py-5">
                        <span className="font-semibold">
                          {student.completedLevels}
                        </span>

                        <span className="text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                          {" "}
                          / {student.courseLevels}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        {progress === 100 ? (
                          <span className="rounded-full bg-[#E1DCC9] px-3 py-1.5 text-xs font-bold text-[#1F150C] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                            Completed
                          </span>
                        ) : progress > 0 ? (
                          <span className="rounded-full bg-[#F5EEDD] px-3 py-1.5 text-xs font-bold text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                            In Progress
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#F8F3EC] px-3 py-1.5 text-xs font-bold text-[#412D15]/80 dark:bg-[#2A1D10] dark:text-[#E1DCC9]/80">
                            Not Started
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="space-y-3 p-4 md:hidden">
            {filteredStudents.map((student) => {
              const progress =
                student.courseLevels > 0
                  ? Math.round(
                      (student.completedLevels / student.courseLevels) * 100,
                    )
                  : 0;

              return (
                <div
                  key={student.id}
                  className="rounded-2xl border border-[#412D15]/15 bg-[#F8F3EC] p-4 dark:border-[#E1DCC9]/10 dark:bg-[#20170E]"
                >
                  {/* Student */}
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-[#000000] dark:text-[#E1DCC9]">
                        {student.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                        @{student.username}
                      </p>
                    </div>

                    <span className="text-lg font-bold text-[#412D15] dark:text-[#E1DCC9]">
                      {progress}%
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                      <span>Progress</span>

                      <span>
                        {student.completedLevels}/{student.courseLevels}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#E1DCC9] dark:bg-[#412D15]/50">
                      <div
                        className="h-full rounded-full bg-[#412D15] dark:bg-[#E1DCC9]"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-4">
                    {progress === 100 ? (
                      <span className="rounded-full bg-[#E1DCC9] px-3 py-1.5 text-xs font-bold text-[#1F150C] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                        Completed
                      </span>
                    ) : progress > 0 ? (
                      <span className="rounded-full bg-[#F5EEDD] px-3 py-1.5 text-xs font-bold text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                        In Progress
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#F8F3EC] px-3 py-1.5 text-xs font-bold text-[#412D15]/80 dark:bg-[#2A1D10] dark:text-[#E1DCC9]/80">
                        Not Started
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* No students */}
          {filteredStudents.length === 0 && (
            <div className="p-12 text-center">
              <FiUsers className="mx-auto text-4xl text-[#412D15]/30 dark:text-[#E1DCC9]/50" />

              <p className="mt-4 font-semibold">No students found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
