import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Loading from "../Elements/Loading";
import { useSelector } from "react-redux";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function MyAnswers() {
  const { id, userId: paramUserId } = useParams(); // استدعاء useParams مرة واحدة في الأعلى
  const { role, userId: reduxUserId } = useSelector((state) => state.user);

  // تحديد الـ userId بناءً على الدور
  const userId = role === "teacher" ? paramUserId : reduxUserId;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [timeLimit, setTimeLimit] = useState(0);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quiz/myanswers/${userId}/${id}`);
      const quizData = response.data;
      setQuestions(quizData?.questions?.questions || []);
      setTimeLimit(quizData?.questions?.timeLimit);
      setScore(response.data.score);
    } catch (error) {
      console.error("Error fetching Quiz:", error);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await fetchQuiz();
      setLoading(false);
    };

    if (userId && id) {
      loadAllData();
    }
  }, [id, userId]);

  if (loading) {
    return <Loading />;
  }

  if (questions.length === 0 || !score) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4 text-center text-lg font-bold text-[#1F150C] dark:text-[#E1DCC9]">
        No quiz data available.
      </div>
    );
  }

  const timeSpent = Number(timeLimit) * 60 - Number(score?.timeFinished || 0);
  const isPassed = score.score >= 0.5 * score.totalScore;

  return (
    <>
      {isPassed ? (
        <div className="relative min-h-[90vh] w-full overflow-y-auto bg-[#E1DCC9] p-4 text-[#1F150C] dark:bg-[#1F150C] dark:text-[#E1DCC9] sm:p-6">
          <div className="fixed left-0 right-0 top-20 z-10 flex items-center justify-between px-4 sm:px-10">
            <div className="rounded-full border border-[#412D15]/15 bg-[#F8F3EC]/60 px-4 py-1.5 text-sm font-bold text-[#1F150C] shadow-[0_8px_16px_rgba(31,21,12,0.04)] backdrop-blur dark:border-[#E1DCC9]/10 dark:bg-[#20170E]/80 dark:text-[#E1DCC9]">
              {score.score}/{score.totalScore}
            </div>
            <div className="mr-10 rounded-full border border-[#412D15]/15 bg-[#F8F3EC]/60 px-4 py-1.5 text-sm font-bold text-[#1F150C] shadow-[0_8px_16px_rgba(31,21,12,0.04)] backdrop-blur dark:border-[#E1DCC9]/10 dark:bg-[#20170E]/80 dark:text-[#E1DCC9]">
              <span>
                {Math.floor(Number(timeSpent) / 60)}:
                {String(Number(timeSpent) % 60).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="pt-16">
            {questions.map((q, indexq) => {
              const incorrectQuestion = score?.incorrectQuestions?.find(
                (item) => item.questionId === q._id,
              );

              return (
                <div key={q._id} className="my-6 px-2 sm:px-16">
                  <div className="flex items-center gap-2 text-lg font-semibold leading-relaxed sm:text-2xl md:text-3xl">
                    <span
                      className={
                        q._id === incorrectQuestion?.questionId
                          ? "text-[#A85E4D]"
                          : "text-[#597053]"
                      }
                    >
                      {q._id === incorrectQuestion?.questionId ? (
                        <FiXCircle />
                      ) : (
                        <FiCheckCircle />
                      )}
                    </span>
                    <h2>
                      {indexq + 1}. {q.question}
                    </h2>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:gap-4">
                    {q.options?.map((option, index) => {
                      const isWrong = incorrectQuestion?.wrongAnswer === index;
                      const isCorrect = q?.correctAnswer === index;

                      return (
                        <button
                          key={index}
                          className={`w-full rounded-xl border px-4 py-3 text-start text-sm font-medium sm:text-lg ${
                            isCorrect
                              ? "border-[#597053] bg-[#597053] text-[#F8F3EC] shadow-[0_10px_18px_rgba(89,112,83,0.15)]"
                              : isWrong
                                ? "border-[#A85E4D] bg-[#A85E4D] text-[#F8F3EC] shadow-[0_10px_18px_rgba(168,94,77,0.15)]"
                                : "border-[#412D15]/15 bg-[#F8F3EC] text-[#1F150C] dark:border-[#E1DCC9]/10 dark:bg-[#20170E] dark:text-[#E1DCC9]"
                          }`}
                        >
                          <span className="mr-2 inline-block font-bold sm:mr-3">
                            {index + 1}.
                          </span>{" "}
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-screen items-center justify-center text-lg font-bold">
          Score is below passing threshold.
        </div>
      )}
    </>
  );
}