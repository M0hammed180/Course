import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Loading from "../Elements/Loading";

export default function EditLevel() {
  const { id } = useParams();
  const [level, setLevel] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [levelId, setLevelId] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [type, setType] = useState("video");
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

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/level/${id}`);
        const data = response.data.level;
        console.log(data);
        setQuestions(data?.quizId?.questions || []);
        setLevel(data.level);
        setTitle(data.title);
        setDescription(data.description);
        setType(data.type || "video");
        setVideo(data?.video || "");
        setVideoPreview(data?.video || "");
        setTimeLimit(data?.quizId?.timeLimit || "");
      } catch (error) {
        if (error.response) {
          console.error(error.response);
        } else {
          console.error("Network Error:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLevel();
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();

    const data = {
      levelId: id,
      level,
      title,
      description,
      type,
      video: type === "video" ? video : "",
      questions: type === "quiz" ? JSON.stringify(questions) : [],
      timeLimit: type === "quiz" ? timeLimit : "",
    };

    setLoading(true);

    try {
      const response = await axios.patch(
        "http://localhost:3000/level/edit",
        data,
      );

      console.log("Success:", response.data.message);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
      } else {
        console.error("Network Error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <div className="min-h-1/2 bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div
          className={`mx-auto flex w-full ${
            type == "quiz" ? "max-w-6xl" : "max-w-5xl"
          } flex-col items-start gap-8 lg:flex-row`}
        >
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8 lg:flex-1">
            <h1 className="mb-6 text-center text-3xl font-semibold text-slate-800 dark:text-slate-100">
              Edit Level
            </h1>

            <form onSubmit={handleEdit} className="w-full">
              <div
                className={`grid gap-6 ${type == "quiz" ? "lg:grid-cols-2" : ""}`}
              >
                <div className="flex w-full flex-col gap-3">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="select"
                    >
                      Select Level Type:
                    </label>
                    <select
                      className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                      name=""
                      id="select"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option
                        className="bg-white text-black dark:text-white dark:bg-slate-700"
                        value="video"
                      >
                        video
                      </option>
                      <option
                        className="bg-white text-black dark:text-white dark:bg-slate-700"
                        value="quiz"
                      >
                        quiz
                      </option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      id="title"
                      name="title"
                      className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="levels"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Level
                    </label>
                    <input
                      type="number"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      id="levels"
                      name="levels"
                      className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    />
                  </div>
                  {type === "quiz" && (
                    <div>
                      <label
                        htmlFor="timeLimit"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Time Limit
                      </label>
                      <input
                        type="number"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        id="timeLimit"
                        name="timeLimit"
                        className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                      />
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      type="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      id="description"
                      rows="2"
                      name="description"
                      className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    ></textarea>
                  </div>
                  {type == "video" && (
                    <div>
                      <label
                        htmlFor="video"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Video
                      </label>
                      <input
                        id="video"
                        value={video}
                        type="text"
                        onChange={(e) => {
                          setVideo(e.target.value);
                          setVideoPreview(e.target.value);
                        }}
                        name="video"
                        className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                      />
                    </div>
                  )}
                </div>

                {type == "quiz" && (
                  <div className="contents">
                    {questions.map((q, index) => (
                      <div
                        key={index}
                        className="flex w-full flex-col items-center justify-center space-y-3 rounded-3xl bg-white p-3 text-black dark:bg-slate-700 dark:text-white"
                      >
                        <input
                          placeholder={`Question ${index + 1}`}
                          className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
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
                              className="mt-1 p-2 w-1/2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
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
                          className="p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                        >
                          <option
                            className="bg-white text-black dark:text-white dark:bg-slate-700"
                            value=""
                            disabled
                          >
                            Correct Answer
                          </option>
                          <option
                            className="bg-white text-black dark:text-white dark:bg-slate-700"
                            value={0}
                          >
                            Option 1
                          </option>
                          <option
                            className="bg-white text-black dark:text-white dark:bg-slate-700"
                            value={1}
                          >
                            Option 2
                          </option>
                          <option
                            className="bg-white text-black dark:text-white dark:bg-slate-700"
                            value={2}
                          >
                            Option 3
                          </option>
                          <option
                            className="bg-white text-black dark:text-white dark:bg-slate-700"
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
                            className="w-full rounded-2xl bg-cyan-600 p-3 font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 "
                          >
                            Remove Question
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={addQuestion}
                            className="w-full rounded-2xl bg-cyan-600 p-3 font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 "
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
                  className="w-full rounded-2xl bg-cyan-600 p-3 font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 mt-4"
                >
                  Edit
                </button>
              </div>
            </form>
          </div>
          {type == "video" &&
            videoPreview &&
            getYoutubeEmbedUrl(videoPreview) && (
              <div className="flex h-fit w-full flex-col items-start justify-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8 lg:flex-1">
                <h1 className="mb-6 text-center text-3xl font-semibold text-slate-800 dark:text-slate-100">
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
