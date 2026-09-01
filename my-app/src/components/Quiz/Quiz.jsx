import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Loading from "../Elements/Loading";
import { useSelector } from "react-redux";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [n, setN] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const { userId } = useSelector((state) => state.user);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quiz/quiz/${id}`);
      const quizData = response.data.quiz;
      setQuiz(quizData);
      setQuestions(quizData?.questions || []);
    } catch (error) {
      console.error("Error fetching Quiz:", error);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setN(0);
      setSelectedAnswers([]);
      await fetchQuiz();
      setLoading(false);
    };

    loadAllData();
  }, [id]);

  const currentQuestion = questions[n] || null;

  const handleSelectOption = (optionIndex, id) => {
    setSelectedAnswers((prev) => {
      const updated = [...prev];
      updated[n] = { id, optionIndex: optionIndex };
      return updated;
    });
  };

  const handleSubmitQuiz = async () => {
    try {
      const payload = {
        userId,
        quizId: id,
        answers: selectedAnswers,
        timeFinished: timeLeft,
      };
      await api.post(`/quiz/submit`, payload);
      navigate(-1);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  useEffect(() => {
    if (!quiz?.timeLimit) return;

    setTimeLeft(quiz.timeLimit * 60);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz]);

  if (loading) {
    return <Loading />;
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4 text-center text-lg font-bold text-[#1F150C] dark:text-[#E1DCC9]">
        No quiz data available.
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[90vh] w-full flex-col justify-between overflow-y-auto bg-[#E1DCC9] p-4 text-[#1F150C] dark:bg-[#1F150C] dark:text-[#E1DCC9] sm:p-6">
      <div className="flex gap-2 px-2 sm:items-center sm:justify-between sm:px-10">
        <div className="self-start rounded-full border border-[#412D15]/15 bg-[#F8F3EC] px-4 py-1.5 text-sm font-bold text-[#1F150C] shadow-[0_8px_16px_rgba(31,21,12,0.04)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E] dark:text-[#E1DCC9] sm:px-5 sm:py-2 sm:text-lg">
          Question {n + 1} of {questions.length}
        </div>
        <div className="self-start rounded-full border border-[#412D15]/15 bg-[#F8F3EC] px-4 py-1.5 text-sm font-bold text-[#1F150C] shadow-[0_8px_16px_rgba(31,21,12,0.04)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E] dark:text-[#E1DCC9] sm:self-auto sm:px-5 sm:py-2 sm:text-lg">
          {quiz.timeLimit
            ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`
            : "Unlimited"}
        </div>
      </div>

      {currentQuestion && (
        <div className="my-6 flex-1 px-2 sm:px-16">
          <h2 className="text-lg font-semibold leading-relaxed text-[#1F150C] dark:text-[#E1DCC9] sm:text-2xl md:text-3xl">
            {n + 1}.{" "}
            {currentQuestion.questionText ||
              currentQuestion.title ||
              currentQuestion.question}
          </h2>

          <div className="mt-6 flex flex-col gap-3 sm:gap-4">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = selectedAnswers[n]?.optionIndex === index;

              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index, currentQuestion._id)}
                  className={`w-full cursor-pointer rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 sm:rounded-2xl sm:px-6 sm:py-4 sm:text-lg ${
                    isSelected
                      ? "border-[#597053] bg-[#597053] text-[#F8F3EC] shadow-[0_10px_20px_rgba(89,112,83,0.18)]"
                      : "border-[#412D15]/15 bg-[#F8F3EC] text-[#1F150C] hover:bg-[#E6DFC8] dark:border-[#E1DCC9]/10 dark:bg-[#20170E] dark:text-[#E1DCC9] dark:hover:bg-[#2A1D10]"
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
      )}

      <div className="flex items-center justify-between gap-3 border-t border-[#412D15]/15 px-2 pt-4 dark:border-[#E1DCC9]/10 sm:border-0 sm:px-10">
        <button
          onClick={() => setN((prev) => Math.max(prev - 1, 0))}
          disabled={n === 0}
          className="cursor-pointer rounded-full border border-[#412D15]/15 bg-[#F8F3EC] px-5 py-2 text-sm font-bold text-[#1F150C] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#E1DCC9]/10 dark:bg-[#20170E] dark:text-[#E1DCC9] sm:px-6 sm:text-lg"
        >
          Previous
        </button>

        {n === questions.length - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            className="cursor-pointer rounded-full bg-[#412D15] px-6 py-2 text-sm font-bold text-[#E1DCC9] shadow-[0_10px_20px_rgba(31,21,12,0.12)] transition-all hover:bg-[#2D1F12] dark:bg-[#E1DCC9] dark:text-[#1F150C] dark:hover:bg-[#F8F3EC] sm:px-8 sm:text-lg"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() =>
              setN((prev) => Math.min(prev + 1, questions.length - 1))
            }
            disabled={n === questions.length - 1}
            className="cursor-pointer rounded-full border border-[#412D15]/15 bg-[#F8F3EC] px-5 py-2 text-sm font-bold text-[#1F150C] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#E1DCC9]/10 dark:bg-[#20170E] dark:text-[#E1DCC9] sm:px-6 sm:text-lg"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
