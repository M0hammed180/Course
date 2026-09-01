import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useSelector } from "react-redux";
import Loading from "../Elements/Loading";

export default function Purchased() {
  const { userId, role } = useSelector((state) => state.user);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState({});
  const [mycompletecourses, setMycompletecourses] = useState([]);
  const [score, setScorecore] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/progress/mycompletecourses/${userId}`);
        setMycompletecourses(response.data.courses || []);
        setScorecore(response.data.score || []);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [userId]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await api.get(`/progress/myachievements/${userId}`);
        setAchievements(response.data || {});
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };

    fetchAchievements();
  }, [userId]);

  useEffect(() => {
    const fetchPurchased = async () => {
      try {
        const response = await api.get(`/course/purchasedcourses/${userId}`);
        setCourse(response.data.myPayments);
      } catch (error) {
        console.error("Error fetching purchased courses:", error);
      }
    };

    fetchPurchased();
  }, [userId]);

  const levelProgress = achievements.totalLevels
    ? (achievements.completedLevels / achievements.totalLevels) * 100
    : 0;

  const courseProgress = achievements.totalCourses
    ? (achievements.completedCourses / achievements.totalCourses) * 100
    : 0;

  const quizProgress = achievements.totalQuizScore
    ? (achievements.quizScore / achievements.totalQuizScore) * 100
    : 0;

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E1DCC9] px-4 text-[#1F150C] dark:bg-[#1F150C] dark:text-[#E1DCC9]">
        <div className="rounded-2xl border border-[#412D15]/15 bg-[#F8F3EC] px-6 py-4 text-[#412D15] shadow-[0_10px_25px_rgba(31,21,12,0.08)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E] dark:text-[#E1DCC9]">
          Course not found!
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E1DCC9] px-3 py-5 md:px-6 dark:bg-black">
      {role == "student" && (
        <div className="bg-[#E1DCC9] p-5 dark:bg-black">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#1F150C] dark:text-[#E1DCC9]">
              My Learning
            </h1>
            <p className="mt-2 text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
              Track your learning progress and achievements
            </p>
          </div>

          <div className="rounded-[28px] border border-[#412D15]/15 bg-[#F8F3EC] p-6 shadow-[0_18px_35px_rgba(31,21,12,0.08)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E]">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-[#412D15]/15 bg-[#E1DCC9] p-4 dark:border-[#E1DCC9]/10 dark:bg-[#2A1D10]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                    Levels
                  </span>
                  <span className="font-bold text-[#412D15] dark:text-[#E1DCC9]">
                    {levelProgress ? Math.round(levelProgress) + "%" : "0%"}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F8F3EC] dark:bg-[#412D15]/40">
                  <div
                    className="h-full rounded-full bg-[#412D15] transition-all dark:bg-[#E1DCC9]"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                  {achievements.completedLevels} / {achievements.totalLevels}{" "}
                  completed
                </p>
              </div>

              <div className="rounded-2xl border border-[#412D15]/15 bg-[#E1DCC9] p-4 dark:border-[#E1DCC9]/10 dark:bg-[#2A1D10]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                    Courses
                  </span>
                  <span className="font-bold text-[#412D15] dark:text-[#E1DCC9]">
                    {courseProgress ? Math.round(courseProgress) + "%" : "0%"}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F8F3EC] dark:bg-[#412D15]/40">
                  <div
                    className="h-full rounded-full bg-[#597053] transition-all"
                    style={{ width: `${courseProgress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                  {achievements.completedCourses} / {achievements.totalCourses}{" "}
                  completed
                </p>
              </div>

              <div className="rounded-2xl border border-[#412D15]/15 bg-[#E1DCC9] p-4 dark:border-[#E1DCC9]/10 dark:bg-[#2A1D10]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                    Quiz Score
                  </span>
                  <span className="font-bold text-[#597053] dark:text-[#D9E5CF]">
                    {quizProgress ? Math.round(quizProgress) + "%" : "0%"}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F8F3EC] dark:bg-[#412D15]/40">
                  <div
                    className="h-full rounded-full bg-[#597053] transition-all"
                    style={{ width: `${quizProgress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                  {achievements.quizScore} / {achievements.totalQuizScore}{" "}
                  points
                </p>
              </div>

              <div className="rounded-2xl border border-[#412D15]/15 bg-[#E1DCC9] p-4 dark:border-[#E1DCC9]/10 dark:bg-[#2A1D10]">
                <span className="text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                  Interaction
                </span>
                <p className="mt-2 text-3xl font-bold text-[#1F150C] dark:text-[#E1DCC9]">
                  {achievements.comments}
                </p>
                <p className="mt-1 text-xs text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                  Comments written
                </p>
              </div>
            </div>
          </div>

          {mycompletecourses.length >= 1 ? (
            <div className="mt-6">
              <h2 className="mb-4 text-xl font-bold text-[#1F150C] dark:text-[#E1DCC9]">
                My Courses
              </h2>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {mycompletecourses.map((course) => {
                  const progress = (course.completed / course.total) * 100;

                  return (
                    <div
                      key={course.name}
                      className="rounded-3xl border border-[#412D15]/15 bg-[#F8F3EC] p-5 shadow-[0_18px_35px_rgba(31,21,12,0.08)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E]"
                    >
                      <h3 className="font-bold text-[#1F150C] dark:text-[#E1DCC9]">
                        {course.name}
                      </h3>

                      <p className="mt-1 text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                        {course.completed} of {course.total} levels completed
                      </p>

                      <div className="mt-4 h-2 rounded-full bg-[#E1DCC9] dark:bg-[#412D15]/50">
                        <div
                          className="h-2 rounded-full bg-[#412D15] dark:bg-[#E1DCC9]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mt-3 flex justify-between text-xs text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                        <span>{Math.round(progress)}%</span>
                        <span>
                          {course.completed}/{course.total}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {score.length >= 1 ? (
            <div className="mt-6">
              <h2 className="mb-4 text-xl font-bold text-[#1F150C] dark:text-[#E1DCC9]">
                Quizzes
              </h2>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {score.map((quiz) => {
                  const progress =
                    quiz.total > 0 ? (quiz.completed / quiz.total) * 100 : 0;

                  return (
                    <Link
                      key={quiz.quizId}
                      to={`/myanswers/${quiz.quizId}`}
                      className="rounded-3xl border border-[#412D15]/15 bg-[#F8F3EC] p-5 shadow-[0_18px_35px_rgba(31,21,12,0.08)] transition-transform duration-200 hover:-translate-y-1 dark:border-[#E1DCC9]/10 dark:bg-[#20170E]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-[#1F150C] dark:text-[#E1DCC9]">
                            {quiz.quizName || "Quiz"}
                          </h3>
                          <p className="mt-1 text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                            {quiz.completed} / {quiz.total} completed
                          </p>
                        </div>
                        <span className="rounded-full bg-[#E1DCC9] px-3 py-1 text-xs font-bold text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                          {Math.round(progress)}%
                        </span>
                      </div>

                      <div className="mt-4 h-2 rounded-full bg-[#E1DCC9] dark:bg-[#412D15]/50">
                        <div
                          className="h-2 rounded-full bg-[#597053]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}

          {course && course.length > 0 ? (
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1F150C] dark:text-[#E1DCC9]">
                  My Purchased Courses
                </h2>
                <span className="rounded-full bg-[#E1DCC9] px-3 py-1 text-xs font-bold text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                  {course.length}
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {course.map((c) => (
                  <Link
                    key={c._id}
                    to={`/course/${c._id}`}
                    className="group w-full overflow-hidden rounded-3xl border border-[#412D15]/15 bg-[#F8F3EC] shadow-[0_18px_35px_rgba(31,21,12,0.08)] transition-all duration-200 hover:-translate-y-1 dark:border-[#E1DCC9]/10 dark:bg-[#20170E] md:w-[32%]"
                  >
                    <img
                      src={c.photo}
                      alt={c.name}
                      className="h-40 w-full object-cover"
                    />

                    <div className="flex items-center justify-between gap-2 p-3">
                      <p className="text-sm font-semibold uppercase text-[#1F150C] dark:text-[#E1DCC9]">
                        {c.name}
                      </p>
                      <span className="rounded-full bg-[#412D15] px-2 py-1 text-[10px] font-semibold text-[#E1DCC9] dark:bg-[#E1DCC9] dark:text-[#1F150C]">
                        Open
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
