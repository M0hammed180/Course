import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import Loading from "../Elements/Loading";

export default function EditLevel() {
  const { id } = useParams();
  const [level, setLevel] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [type, setType] = useState("video");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: null, points: 1 },
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
      { question: "", options: ["", "", "", ""], correctAnswer: 0, points: 1 },
    ]);
  };

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const response = await api.get(`/level/${id}`);
        const data = response.data.level;
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
      await api.patch("/level/edit", data);
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
    <div className="min-h-1/2 bg-[#E1DCC9] px-4 py-10 text-[#1F150C] dark:bg-[#1F150C] dark:text-[#E1DCC9] sm:px-6 lg:px-8">
      <div
        className={`mx-auto flex w-full ${
          type === "quiz" ? "max-w-6xl" : "max-w-5xl"
        } flex-col items-start gap-8 lg:flex-row`}
      >
        <div className="w-full rounded-3xl border border-[#412D15]/15 bg-[#F8F3EC] p-6 shadow-xl dark:border-[#E1DCC9]/10 dark:bg-[#20170E] sm:p-8 lg:flex-1">
          <h1 className="mb-6 text-center text-3xl font-semibold text-[#1F150C] dark:text-[#E1DCC9]">
            Edit Level
          </h1>

          <form onSubmit={handleEdit} className="w-full">
            <div
              className={`grid gap-6 ${type === "quiz" ? "lg:grid-cols-2" : ""}`}
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
                    className="mt-1 w-full rounded-md border border-[#412D15]/15 bg-[#FFFDF9] p-2 text-[#1F150C] transition focus:border-[#412D15] focus:outline-none focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                    id="select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="video">video</option>
                    <option value="quiz">quiz</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-[#412D15] dark:text-[#E1DCC9]"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    id="title"
                    name="title"
                    className="mt-1 w-full rounded-md border border-[#412D15]/15 bg-[#FFFDF9] p-2 text-[#1F150C] transition focus:border-[#412D15] focus:outline-none focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
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
                    className="mt-1 w-full rounded-md border border-[#412D15]/15 bg-[#FFFDF9] p-2 text-[#1F150C] transition focus:border-[#412D15] focus:outline-none focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
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
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                      id="timeLimit"
                      name="timeLimit"
                      className="mt-1 w-full rounded-md border border-[#412D15]/15 bg-[#FFFDF9] p-2 text-[#1F150C] transition focus:border-[#412D15] focus:outline-none focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="description"
                    rows="2"
                    name="description"
                    className="mt-1 w-full rounded-md border border-[#412D15]/15 bg-[#FFFDF9] p-2 text-[#1F150C] transition focus:border-[#412D15] focus:outline-none focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                  ></textarea>
                </div>

                {type === "video" && (
                  <div>
                    <label
                      htmlFor="video"
                      className="block text-sm font-medium text-[#412D15] dark:text-[#E1DCC9]"
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
                      className="mt-1 w-full rounded-md border border-[#412D15]/15 bg-[#FFFDF9] p-2 text-[#1F150C] transition focus:border-[#412D15] focus:outline-none focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                    />
                  </div>
                )}
              </div>

              {type === "quiz" && (
                <div className="contents">
                  {questions.map((q, index) => (
                    <div
                      key={index}
                      className="flex w-full flex-col items-center justify-center space-y-3 rounded-3xl bg-[#F8F3EC] p-3 text-[#1F150C] shadow-sm dark:bg-[#2A1D10] dark:text-[#E1DCC9]"
                    >
                      <input
                        placeholder={`Question ${index + 1}`}
                        className="mt-1 w-full rounded-md border border-[#412D15]/15 bg-[#FFFDF9] p-2 text-[#1F150C] transition focus:border-[#412D15] focus:outline-none focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:placeholder:text-[#E1DCC9]/60 dark:focus:border-[#E1DCC9]"
                        value={q.question}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[index].question = e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                      />

                      <div className="flex w-full flex-wrap items-center justify-center gap-2">
                        {q.options.map((option, optionIndex) => (
                          <input
                            key={optionIndex}
                            className="mt-1 w-[48%] rounded-md border border-[#412D15]/15 bg-[#FFFDF9] p-2 text-[#1F150C] transition focus:border-[#412D15] focus:outline-none focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:placeholder:text-[#E1DCC9]/60 dark:focus:border-[#E1DCC9]"
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
                        className="w-full rounded-md border border-[#412D15]/15 bg-[#FFFDF9] p-2 text-[#1F150C] transition focus:border-[#412D15] focus:outline-none focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                      >
                        <option value="" disabled>
                          Correct Answer
                        </option>
                        <option value={0}>Option 1</option>
                        <option value={1}>Option 2</option>
                        <option value={2}>Option 3</option>
                        <option value={3}>Option 4</option>
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

            <button
              type="submit"
              className="mt-4 w-full rounded-2xl bg-[#412D15] p-3 font-semibold text-[#E1DCC9] transition hover:bg-[#1F150C] dark:bg-[#E1DCC9] dark:text-[#1F150C] dark:hover:bg-[#F8F3EC]"
            >
              Edit
            </button>
          </form>
        </div>

        {type === "video" &&
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
  );
}
