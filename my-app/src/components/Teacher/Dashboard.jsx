import React from "react";
import { Link } from "react-router-dom";
import api from "../api";
import {
  FiBookOpen,
  FiUsers,
  FiLayers,
  FiHelpCircle,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiArrowUpRight,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from "../Elements/Loading";

export default function Dashboard() {
  const { userId } = useSelector((state) => state.user);
  const [stats, setStats] = useState({});
  const [pages, setPages] = useState({});
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCourse, setPageCourse] = useState(1);
  const [pageQuiz, setPageQuiz] = useState(1);
  const [pageStudent, setPageStudent] = useState(1);

  const fetchDashboard = async () => {
    try {
      // setLoading(true);

      const response = await api.get(
        `http://localhost:3000/progress/studentachivmentforeacher/${userId}/${pageCourse}/${pageQuiz}/${pageStudent}`,
      );

      const data = response.data;

      setStats(data.stats || {});
      setCourses(data.myCoursesAchivmentsN || []);
      setStudents(data.progressN || []);
      setQuizzes(data.myAllQuizDegreesN || []);
      setPages(data.pages);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    if (userId) {
      fetchDashboard();
    }
  }, [userId, pageQuiz, pageStudent, pageCourse]);

  const statsArray = [
    {
      title: "Courses",
      value: stats.Courses,
      icon: <FiBookOpen />,
    },
    {
      title: "Students",
      value: stats.Students,
      icon: <FiUsers />,
    },
    {
      title: "Levels",
      value: stats.Levels,
      icon: <FiLayers />,
    },
    {
      title: "Quizzes",
      value: stats.Quizzes,
      icon: <FiHelpCircle />,
    },
    {
      title: "Comments",
      value: stats.Comments,
      icon: <FiMessageSquare />,
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#E1DCC9] p-4 text-[#1F150C] transition-colors dark:bg-[#1F150C] dark:text-[#E1DCC9] md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#412D15] dark:text-[#E1DCC9]">
              Teacher Area
            </p>
            <h1 className="mt-2 text-2xl font-black text-[#1F150C] dark:text-[#E1DCC9] md:text-3xl">
              Dashboard
            </h1>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statsArray.map((stat) => (
            <div
              key={stat.title}
              className="rounded-[1.5rem] border border-[#412D15]/15 bg-[#F8F3EC] p-4 shadow-[0_10px_25px_rgba(31,21,12,0.06)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[#412D15]/70 dark:text-[#E1DCC9]/80">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-[#1F150C] dark:text-[#E1DCC9]">
                    {stat.value}
                  </h2>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E1DCC9] text-xl text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                    {stat.icon}
                  </div>
                  {stat.title === "Comments" && (
                    <Link
                      to="mycomments"
                      className="text-[#412D15] transition hover:translate-x-0.5 dark:text-[#E1DCC9]"
                    >
                      <FiArrowUpRight size={24} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Courses + Activity */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Courses */}
          <div className="rounded-[1.75rem] border border-[#412D15]/15 bg-[#F8F3EC] p-4 shadow-[0_12px_28px_rgba(31,21,12,0.08)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E] lg:col-span-2 md:p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-[#1F150C] dark:text-[#E1DCC9]">
                  Your Courses
                </h2>

                <p className="mt-1 text-sm text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                  Performance of your courses
                </p>
              </div>
              {pages.course > 1 && (
                <p>
                  {pageCourse}/{pages.course}
                </p>
              )}
              <div className="flex items-center gap-3">
                {pageCourse > 1 && (
                  <FiChevronLeft
                    onClick={() => setPageCourse((prev) => prev - 1)}
                    className="text-2xl cursor-pointer"
                  />
                )}
                {pageCourse < pages.course && (
                  <FiChevronRight
                    onClick={() => setPageCourse((prev) => prev + 1)}
                    className="text-2xl cursor-pointer"
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              {courses.map((course) => {
                const averageProgress =
                  course.completedLevels > 0
                    ? Math.round(
                        (course.completedLevels / course.totalCourseLevels) *
                          100,
                      )
                    : 0;
                return (
                  <Link
                    key={course.id}
                    to={`/studentsprogress/${course.id}`}
                    className="block rounded-2xl border border-[#412D15]/15 bg-[#FFFDF9] p-4 transition hover:border-[#412D15]/40 hover:shadow-[0_10px_20px_rgba(31,21,12,0.08)] dark:border-[#E1DCC9]/10 dark:bg-[#2A1D10]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-black text-[#1F150C] dark:text-[#E1DCC9]">
                          {course.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <p className="mt-1 text-xs text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                            {course.students} students
                          </p>
                          <p className="mt-1 text-xs text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                            {course.levels} levels
                          </p>
                        </div>
                      </div>

                      <span className="font-black text-[#412D15] dark:text-[#E1DCC9]">
                        {averageProgress}%
                      </span>
                    </div>

                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#E1DCC9] dark:bg-[#412D15]/60">
                      <div
                        className="h-full rounded-full bg-[#412D15] dark:bg-[#E1DCC9]"
                        style={{
                          width: `${averageProgress}%`,
                        }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quizzes */}
          <div className="rounded-[1.75rem] border border-[#412D15]/15 bg-[#F8F3EC] p-4 shadow-[0_12px_28px_rgba(31,21,12,0.08)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E] md:p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-[#1F150C] dark:text-[#E1DCC9]">
                  Quizzes
                </h2>

                <p className="mt-1 text-sm text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                  Your course quizzes
                </p>
              </div>
              {pages.quiz > 1 && (
                <p>
                  {pageQuiz}/{pages.quiz}
                </p>
              )}
              <div className="flex items-center gap-3">
                {pageQuiz > 1 && (
                  <FiChevronLeft
                    onClick={() => setPageQuiz((prev) => prev - 1)}
                    className="text-2xl cursor-pointer"
                  />
                )}
                {pageQuiz < pages.quiz && (
                  <FiChevronRight
                    onClick={() => setPageQuiz((prev) => prev + 1)}
                    className="text-2xl cursor-pointer"
                  />
                )}
              </div>
            </div>

            <div className="space-y-3">
              {quizzes.map((quiz) => {
                const averageScore =
                  quiz.allQuizUserTotalScore > 0
                    ? Math.round(
                        (quiz.allQuizUserScore / quiz.allQuizUserTotalScore) *
                          100,
                      )
                    : 0;
                return (
                  <Link
                    key={quiz._id}
                    to={`/quizstudents/${quiz._id}`}
                    className="block rounded-2xl border border-[#412D15]/15 bg-[#FFFDF9] p-4 transition hover:border-[#412D15]/40 hover:bg-[#F5F0E8] dark:border-[#E1DCC9]/10 dark:bg-[#2A1D10] dark:hover:bg-[#362713]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-black text-[#1F150C] dark:text-[#E1DCC9]">
                          {quiz.title}
                        </h3>

                        <p className="mt-1 text-xs text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                          {quiz.courseName}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-[#E1DCC9] px-3 py-1 text-xs font-bold text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                        {quiz.questionsCount} Questions
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-[#412D15]/70 dark:text-[#E1DCC9]/80">
                      <span>Students: {quiz.studentsCount}</span>

                      <span>Average: {averageScore}%</span>
                    </div>

                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#E1DCC9] dark:bg-[#412D15]/60">
                      <div
                        className="h-full rounded-full bg-[#412D15] dark:bg-[#E1DCC9]"
                        style={{
                          width: `${averageScore}%`,
                        }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Students */}
        <div className="mt-6 rounded-[1.75rem] border border-[#412D15]/15 bg-[#F8F3EC] p-4 shadow-[0_12px_28px_rgba(31,21,12,0.08)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E] md:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-[#1F150C] dark:text-[#E1DCC9]">
                Students Progress
              </h2>

              <p className="mt-1 text-sm text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                Track your students performance
              </p>
            </div>
            {pages.student > 1 && (
              <p>
                {pageStudent}/{pages.student}
              </p>
            )}
            <div className="flex items-center gap-3">
              {pageStudent > 1 && (
                <FiChevronLeft
                  onClick={() => setPageStudent((prev) => prev - 1)}
                  className="text-2xl cursor-pointer"
                />
              )}
              {pageStudent < pages.student && (
                <FiChevronRight
                  onClick={() => setPageStudent((prev) => prev + 1)}
                  className="text-2xl cursor-pointer"
                />
              )}
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#412D15]/15 text-sm text-[#412D15]/70 dark:border-[#E1DCC9]/10 dark:text-[#E1DCC9]/75">
                  <th className="px-4 py-4 font-medium text-start">Student</th>

                  <th className="px-4 py-4 font-medium text-start">Course</th>

                  <th className="px-4 py-4 font-medium">Progress</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => {
                  const progress = (student.completed / student.total) * 100;

                  return (
                    <tr
                      key={index}
                      className="border-b border-[#412D15]/10 last:border-0 dark:border-[#E1DCC9]/10"
                    >
                      <td className="px-4 py-5 font-semibold text-start text-[#1F150C] dark:text-[#E1DCC9]">
                        {student.name}
                      </td>

                      <td className="px-4 py-5 text-sm text-[#412D15]/80 text-start dark:text-[#E1DCC9]">
                        {student.course}
                      </td>

                      <td className="min-w-50 px-4 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-2.5 flex-1 rounded-full bg-[#E1DCC9]">
                            <div
                              className="h-2.5 rounded-full bg-[#412D15]"
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs font-bold text-[#412D15]">
                            {student.completed}/{student.total}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {students.map((student, index) => {
              const progress = (student.completed / student.total) * 100;

              return (
                <Link
                  key={index}
                  to={`/student/${student.id}`}
                  className="block rounded-2xl border border-[#412D15]/15 bg-[#FFFDF9] p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-[#1F150C] dark:text-[#E1DCC9]">
                        {student.name}
                      </h3>

                      <p className="mt-1 text-xs text-[#412D15]/70 dark:text-[#E1DCC9]">
                        {student.course}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-xs text-[#412D15]/75">
                      <span>Progress</span>
                      <span>
                        {student.completed}/{student.total}
                      </span>
                    </div>

                    <div className="h-2.5 rounded-full bg-[#E1DCC9]">
                      <div
                        className="h-2.5 rounded-full bg-[#412D15]"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
