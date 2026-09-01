import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useParams } from "react-router-dom";
import {
  FiUsers,
  FiHelpCircle,
  FiArrowRight,
  FiSearch,
  FiClock,
} from "react-icons/fi";
import Loading from "../Elements/Loading";

export default function QuizStudents() {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchQuizStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/progress/mystudentquizzes/${quizId}`);

      setQuiz(response.data.myAllStudentsQuizzes?.[0] || null);
    } catch (error) {
      console.error("Error fetching quiz students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      fetchQuizStudents();
    }
  }, [quizId]);

  if (loading) {
    return <Loading />;
  }

  if (!quiz) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#E1DCC9] text-[#1F150C] dark:bg-[#1F150C] dark:text-[#E1DCC9]"
        dir="rtl"
      >
        <p className="text-[#412D15] dark:text-[#E1DCC9]">Quiz not found</p>
      </div>
    );
  }

  const filteredStudents = quiz.students.filter((student) => {
    const value = search.toLowerCase();

    return student.name?.toLowerCase().includes(value);
  });

  const formatTime = (seconds) => {
    const time = Number(seconds) || 0;

    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

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
                {quiz.quizName}
              </h1>

              <p className="mt-2 text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                Students who completed this quiz
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
                    {quiz.numberOfStudents}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#412D15]/15 bg-[#F8F3EC] px-5 py-4 shadow-sm dark:border-[#E1DCC9]/10 dark:bg-[#20170E]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E1DCC9] text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                  <FiHelpCircle />
                </div>

                <div>
                  <p className="text-xs text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                    Quiz
                  </p>

                  <p className="text-xl font-bold text-[#000000] dark:text-[#E1DCC9]">
                    {quiz.students?.[0]?.totalScore || 0}
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

                  <th className="px-6 py-5 font-medium">Score</th>

                  <th className="px-6 py-5 font-medium">Result</th>

                  <th className="px-6 py-5 font-medium">Time</th>

                  <th className="px-6 py-5 font-medium">Answers</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => {
                  const percentage =
                    student.totalScore > 0
                      ? Math.round((student.score / student.totalScore) * 100)
                      : 0;
                  const timeSpent =
                    Number(student.timeLimit) * 60 -
                    Number(student.timeFinished);

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
                              Student
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="px-6 py-5">
                        <span className="font-bold">{student.score}</span>

                        <span className="text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                          {" "}
                          / {student.totalScore}
                        </span>
                      </td>

                      {/* Percentage */}
                      <td className="min-w-56 px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E1DCC9] dark:bg-[#412D15]/50">
                            <div
                              className="h-full rounded-full bg-[#412D15] transition-all duration-500 dark:bg-[#E1DCC9]"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>

                          <span className="w-12 text-left text-sm font-bold text-[#412D15] dark:text-[#E1DCC9]">
                            {percentage}%
                          </span>
                        </div>
                      </td>

                      {/* Time */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                          <FiClock />

                          <span>
                            {Math.floor(Number(timeSpent) / 60)}:
                            {String(Number(timeSpent) % 60).padStart(2, "0")}
                          </span>
                        </div>
                      </td>

                      {/* Answers */}
                      <td className="px-6 py-5">
                        <Link
                          to={`/myanswers/${quizId}/${student.id}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#E1DCC9] px-4 py-2 text-xs font-bold text-[#412D15] transition hover:bg-[#F5F0E8] dark:bg-[#412D15] dark:text-[#E1DCC9] dark:hover:bg-[#1F150C]"
                        >
                          View Answers
                          <FiArrowRight />
                        </Link>
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
              const percentage =
                student.totalScore > 0
                  ? Math.round((student.score / student.totalScore) * 100)
                  : 0;
              const timeSpent =
                Number(student.timeLimit) * 60 - Number(student.timeFinished);

              return (
                <Link
                  key={student.id}
                  to={`/myanswers/${quizId}/${student.id}`}
                  className="block rounded-2xl border border-[#412D15]/15 bg-[#F8F3EC] p-4 transition hover:border-[#412D15]/40 dark:border-[#E1DCC9]/10 dark:bg-[#20170E]"
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

                      <p className="mt-1 text-xs text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                        Quiz result
                      </p>
                    </div>

                    <span className="text-lg font-bold text-[#412D15] dark:text-[#E1DCC9]">
                      {percentage}%
                    </span>
                  </div>

                  {/* Score */}
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                      Score
                    </span>

                    <span className="font-bold text-[#000000] dark:text-[#E1DCC9]">
                      {student.score} / {student.totalScore}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E1DCC9] dark:bg-[#412D15]/50">
                    <div
                      className="h-full rounded-full bg-[#412D15] dark:bg-[#E1DCC9]"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  {/* Time */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                    <FiClock />

                    <span>
                      Time: {Math.floor(Number(timeSpent) / 60)}:
                      {String(Number(timeSpent) % 60).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-4 text-center text-xs font-bold text-[#412D15] dark:text-[#E1DCC9]">
                    View Answers
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Empty */}
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
