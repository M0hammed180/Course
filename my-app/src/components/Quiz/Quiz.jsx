import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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
      const response = await axios.get(`http://localhost:3000/quiz/quiz/${id}`);
      const quizData = response.data.quiz;
      console.log(quizData);

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
      };
      const response = await axios.post(
        `http://localhost:3000/quiz/submit`,
        payload,
      );
      navigate(-1);
      console.log(response.data);
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
      <div className="flex min-h-[80vh] items-center justify-center p-4 text-center text-lg font-bold sm:text-xl dark:text-white">
        No quiz data available.
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[90vh] w-full flex-col justify-between overflow-y-auto p-4 sm:p-6 text-slate-800 dark:text-slate-100">
      <div className="flex  gap-2 sm:items-center sm:justify-between px-2 sm:px-10">
        <div className="self-start rounded-full border border-slate-300 bg-slate-200 px-4 py-1.5 text-sm font-bold text-black sm:px-5 sm:py-2 sm:text-lg dark:border-slate-700 dark:bg-slate-900 dark:text-white">
          Question {n + 1} of {questions.length}
        </div>
        <div className="self-start sm:self-auto rounded-full border border-slate-300 bg-slate-200 px-4 py-1.5 text-sm font-bold text-black sm:px-5 sm:py-2 sm:text-lg dark:border-slate-700 dark:bg-slate-900 dark:text-white">
          {quiz.timeLimit
            ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`
            : "Unlimited"}
        </div>
      </div>

      {currentQuestion && (
        <div className="flex-1 my-6 px-2 sm:px-16">
          <h2 className="text-lg font-semibold sm:text-2xl md:text-3xl leading-relaxed">
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
                  className={`w-full text-left rounded-xl sm:rounded-2xl border px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-lg font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white shadow-md"
                      : "border-slate-300 bg-slate-100 hover:bg-slate-200 text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="mr-2 sm:mr-3 inline-block font-bold">
                    {index + 1}.
                  </span>{" "}
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 px-2 sm:px-10 pt-4 border-t border-slate-200 dark:border-slate-800 sm:border-0">
        <button
          onClick={() => setN((prev) => Math.max(prev - 1, 0))}
          disabled={n === 0}
          className="rounded-full border border-slate-300 bg-slate-200 px-5 py-2 text-sm sm:px-6 sm:text-lg font-bold text-black disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-white cursor-pointer"
        >
          Previous
        </button>

        {n === questions.length - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            className="rounded-full bg-emerald-600 px-6 py-2 text-sm sm:px-8 sm:text-lg font-bold text-white hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() =>
              setN((prev) => Math.min(prev + 1, questions.length - 1))
            }
            disabled={n === questions.length - 1}
            className="rounded-full border border-slate-300 bg-slate-200 px-5 py-2 text-sm sm:px-6 sm:text-lg font-bold text-black disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-white cursor-pointer"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
