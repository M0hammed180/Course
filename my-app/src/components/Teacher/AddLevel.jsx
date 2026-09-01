import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../Elements/Loading";

export default function AddLevel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const levelsLength = localStorage.getItem("levelsLength");
  const [level, setLevel] = useState(levelsLength);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [type, setType] = useState("video");
  const [errorMessage, setErrorMessage] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: null,
      points: 1,
    },
  ]);

  const getYoutubeEmbedUrl = (url) => {
    try {
      const parsedUrl = new URL(url);

      let videoId = "";

      if (parsedUrl.hostname.includes("youtube.com")) {
        videoId = parsedUrl.searchParams.get("v");
      } else if (parsedUrl.hostname === "youtu.be") {
        videoId = parsedUrl.pathname.slice(1);
      }

      if (!videoId) return null;

      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return null;
    }
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 1,
      },
    ]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      type === "quiz" &&
      (!timeLimit ||
        questions.some(
          (question) =>
            !question.question.trim() ||
            question.options.some((option) => !option.trim()) ||
            question.correctAnswer === null,
        ))
    ) {
      setErrorMessage(
        "Complete every quiz question, its four options, and the correct answer.",
      );
      return;
    }

    const data = {
      courseId: id || "",
      level: level || "",
      title: title || "",
      description: description || "",
      type: type || "",
    };

    if (type == "video" && video) {
      data.video = video;
    } else if (type == "quiz") {
      data.questions = JSON.stringify(questions);
      data.timeLimit = timeLimit || "";
    }

    setLoading(true);
    try {
      const response = await api.post("/level/", data);
      navigate(-1);
      console.log("Success:", response.data.message);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.status ||
        "Unable to add the level. Please try again.";
      setErrorMessage(message);
      console.error(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <div className="min-h-1/2 bg-[#E1DCC9] px-4 py-10 text-[#1F150C] dark:bg-[#1F150C] dark:text-[#E1DCC9] sm:px-6 lg:px-8">
        <div
          className={`mx-auto flex w-full ${
            type == "quiz" ? "max-w-6xl" : "max-w-5xl"
          } flex-col items-start gap-8 lg:flex-row`}
        >
          <div className="w-full rounded-3xl border border-[#412D15]/15 bg-[#F8F3EC] p-6 shadow-xl dark:border-[#E1DCC9]/10 dark:bg-[#20170E] sm:p-8 lg:flex-1">
            <h1 className="mb-6 text-center text-3xl font-semibold text-[#1F150C] dark:text-[#E1DCC9]">
              Add Level
            </h1>

            <form onSubmit={handleAdd} className="w-full">
              {errorMessage && (
                <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {errorMessage}
                </p>
              )}
              <div
                className={`grid gap-6 ${type == "quiz" ? "lg:grid-cols-2" : ""}`}
              >
                <div className="flex w-full flex-col gap-3">
                  <div>
                    <label
                      className="block text-sm font-medium text-[#412D15] dark:text-[#E1DCC9]"
                      htmlFor="select"
                    >
                      Select Level Type:
                    </label>
                    <select
                      className="mt-1 p-2 w-full rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                      name=""
                      id="select"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option
                        className="bg-[#FFFDF9] text-[#1F150C] dark:bg-[#20170E] dark:text-[#E1DCC9]"
                        value="video"
                      >
                        video
                      </option>
                      <option
                        className="bg-[#FFFDF9] text-[#1F150C] dark:bg-[#20170E] dark:text-[#E1DCC9]"
                        value="quiz"
                      >
                        quiz
                      </option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-[#412D15] dark:text-[#E1DCC9]"
                    >
                      title
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setTitle(e.target.value)}
                      id="title"
                      name="title"
                      className="mt-1 p-2 w-full rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="levels"
                      className="block text-sm font-medium text-[#412D15] dark:text-[#E1DCC9]"
                    >
                      Level
                    </label>
                    <input
                      type="number"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      id="levels"
                      name="levels"
                      className="mt-1 p-2 w-full rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                    />
                  </div>
                  {type === "quiz" && (
                    <div>
                      <label
                        htmlFor="timeLimit"
                        className="block text-sm font-medium text-[#412D15] dark:text-[#E1DCC9]"
                      >
                        Time Limit
                      </label>
                      <input
                        type="number"
                        onChange={(e) => setTimeLimit(e.target.value)}
                        id="timeLimit"
                        name="timeLimit"
                        className="mt-1 p-2 w-full rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                      />
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-[#412D15] dark:text-[#E1DCC9]"
                    >
                      Description
                    </label>
                    <textarea
                      type="description"
                      onChange={(e) => setDescription(e.target.value)}
                      id="description"
                      rows="2"
                      name="description"
                      className="mt-1 p-2 w-full rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                    ></textarea>
                  </div>
                  {type == "video" && (
                    <div>
                      <label
                        htmlFor="video"
                        className="block text-sm font-medium text-[#412D15] dark:text-[#E1DCC9]"
                      >
                        Video
                      </label>
                      <input
                        id="video"
                        type="text"
                        onChange={(e) => {
                          setVideo(e.target.value);
                          setVideoPreview(e.target.value);
                        }}
                        name="video"
                        className="mt-1 p-2 w-full rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                      />
                    </div>
                  )}
                </div>

                {type == "quiz" && (
                  <div className="contents">
                    {questions.map((q, index) => (
                      <div
                        key={index}
                        className="flex w-full flex-col items-center justify-center space-y-3 rounded-3xl bg-[#F8F3EC] p-3 text-[#1F150C] dark:bg-[#2A1D10] dark:text-[#E1DCC9]"
                      >
                        <input
                          placeholder={`Question ${index + 1}`}
                          className="mt-1 p-2 w-full rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:placeholder:text-[#E1DCC9]/60 dark:focus:border-[#E1DCC9]"
                          value={q.question}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].question = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                        />
                        <div className="flex w-full flex-wrap items-center justify-center">
                          {q.options.map((option, optionIndex) => (
                            <input
                              key={optionIndex}
                              className="mt-1 p-2 w-1/2 rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:placeholder:text-[#E1DCC9]/60 dark:focus:border-[#E1DCC9]"
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[index].options[optionIndex] =
                                  e.target.value;
                                setQuestions(updatedQuestions);
                              }}
                            />
                          ))}
                        </div>
                        <select
                          value={q.correctAnswer ?? ""}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].correctAnswer = Number(
                              e.target.value,
                            );
                            setQuestions(updatedQuestions);
                          }}
                          className="p-2 w-full rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                        >
                          <option
                            className="bg-[#FFFDF9] text-[#1F150C] dark:bg-[#20170E] dark:text-[#E1DCC9]"
                            value=""
                            disabled
                          >
                            Correct Answer
                          </option>
                          <option
                            className="bg-[#FFFDF9] text-[#1F150C] dark:bg-[#20170E] dark:text-[#E1DCC9]"
                            value={0}
                          >
                            Option 1
                          </option>
                          <option
                            className="bg-[#FFFDF9] text-[#1F150C] dark:bg-[#20170E] dark:text-[#E1DCC9]"
                            value={1}
                          >
                            Option 2
                          </option>
                          <option
                            className="bg-[#FFFDF9] text-[#1F150C] dark:bg-[#20170E] dark:text-[#E1DCC9]"
                            value={2}
                          >
                            Option 3
                          </option>
                          <option
                            className="bg-[#FFFDF9] text-[#1F150C] dark:bg-[#20170E] dark:text-[#E1DCC9]"
                            value={3}
                          >
                            Option 4
                          </option>
                        </select>
                        {questions.length !== index + 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setQuestions((prev) =>
                                prev.filter((_, i) => i !== index),
                              )
                            }
                            className="w-full rounded-2xl bg-[#412D15] p-3 font-semibold text-[#E1DCC9] transition hover:bg-[#1F150C]"
                          >
                            Remove Question
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={addQuestion}
                            className="w-full rounded-2xl bg-[#412D15] p-3 font-semibold text-[#E1DCC9] transition hover:bg-[#1F150C]"
                          >
                            ADD Question
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="mt-4 w-full rounded-2xl bg-[#412D15] p-3 font-semibold text-[#E1DCC9] transition hover:bg-[#1F150C]"
                >
                  Add Level
                </button>
              </div>
            </form>
          </div>
          {type == "video" &&
            videoPreview &&
            getYoutubeEmbedUrl(videoPreview) && (
              <div className="flex h-fit w-full flex-col items-start justify-center gap-4 rounded-3xl border border-[#412D15]/15 bg-[#F8F3EC] p-6 shadow-xl dark:border-[#E1DCC9]/10 dark:bg-[#20170E] sm:p-8 lg:flex-1">
                <h1 className="mb-6 text-center text-3xl font-semibold text-[#1F150C] dark:text-[#E1DCC9]">
                  Preview
                </h1>
                <iframe
                  src={getYoutubeEmbedUrl(videoPreview)}
                  title={title}
                  className="h-80 w-full rounded-4xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
