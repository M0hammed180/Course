import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../Elements/Loading";
import { useSelector } from "react-redux";
import YouTube from "react-youtube";
import { FiLock, FiTrash } from "react-icons/fi";
import api from "../api";
export default function Course() {
  const { id } = useParams();
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const hasCompletedRef = useRef(false);
  const hasStartedWatchingRef = useRef(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [current, setCurrent] = useState(0);
  const [course, setCourse] = useState(null);
  const [lastCompletedLevel, setLastCompletedLevel] = useState(null);
  const [nextCourseNumber, setNextCourseNumber] = useState(1);
  const [levels, setLevels] = useState([]);
  const [comments, setComments] = useState([]);
  const [score, setScore] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const { role, userId, isAuthenticated, avatar, userName } = useSelector(
    (state) => state.user,
  );
  //update current & remainig in change level
  useEffect(() => {
    hasCompletedRef.current = false;
    hasStartedWatchingRef.current = false;

    setCurrent(0);
    setRemainingTime(0);
    setScore({});

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    playerRef.current = null;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [selected?._id]);
  //fetch
  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/course/course/${id}`);
      setCourse(response.data.course);
      setLevels(response.data.levels || []);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };
  const fetchComments = async () => {
    try {
      const response = await api.get(`/comment/${id}`);
      setComments(response.data.comments || response.data || []);
    } catch (error) {
      console.error("Error fetching Comments:", error);
    }
  };
  const fetchLastlevel = async () => {
    try {
      const response = await api.get(`/progress/lastlevel/${id}/${userId}`);
      console.log(response.data);
      setLastCompletedLevel(response.data.lastLevel);
      setNextCourseNumber(Number(response.data.numberOfLastLevel) + 1);
      setSelected(response.data.nextLevel);
    } catch (error) {
      console.error("Error fetching Last Level:", error);
    }
  };

  //loadAllData
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCourseDetails(),
        fetchComments(),
        fetchLastlevel(),
      ]);
      setLoading(false);
    };

    loadAllData();
  }, [id]);
  //comment

  const addComment = async (e) => {
    e?.preventDefault();
    if (!commentText.trim()) return;

    try {
      await api.post("/comment", {
        courseId: id,
        userId,
        text: commentText,
      });
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  const handleCancel = () => {
    setCommentText("");
  };
  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comment/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const handleStartEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };
  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      await api.patch(`/comment/`, {
        commentId,
        text: editText,
      });
      setComments(
        comments.map((c) =>
          c._id === commentId ? { ...c, text: editText } : c,
        ),
      );
      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };
  // getScore
  const fetchScore = async () => {
    try {
      const response = await api.get(
        `/quiz/score/${userId}/${selected?.quizId}`,
      );
      console.log(response.data);
      setScore(response.data.score);
    } catch (error) {
      console.error("Error fetching Last Level:", error);
    }
  };
  useEffect(() => {
    if (selected?.type === "quiz" && userId && selected?.quizId) {
      fetchScore();
    }
  }, [selected, userId]);
  //getYoutubeVideoId
  const getYoutubeVideoId = (url) => {
    try {
      const parsedUrl = new URL(url);
      let videoId = "";

      if (parsedUrl.hostname.includes("youtube.com")) {
        videoId = parsedUrl.searchParams.get("v");
      } else if (parsedUrl.hostname === "youtu.be") {
        videoId = parsedUrl.pathname.slice(1);
      }

      return videoId || null;
    } catch {
      return null;
    }
  };
  //progress
  const progress =
    levels.length > 0 && lastCompletedLevel?.level
      ? (lastCompletedLevel.level / levels.length) * 100
      : 0;
  //send Complete Level
  const completeLevel = async () => {
    if (
      !selected?._id ||
      hasCompletedRef.current ||
      !playerRef.current ||
      !hasStartedWatchingRef.current
    ) {
      return;
    }

    const currentTime = playerRef.current.getCurrentTime();
    const duration = playerRef.current.getDuration();

    if (currentTime < 1 || duration <= 0 || duration - currentTime > 60) {
      return;
    }

    hasCompletedRef.current = true;

    try {
      const response = await api.post("/progress/complete", {
        courseId: id,
        levelId: selected._id,
        userId,
      });

      console.log(response.data);

      if (response.data.message !== "Level already completed") {
        setNextCourseNumber(Number(selected.level) + 1);
      }
    } catch (error) {
      hasCompletedRef.current = false;
      console.error("Error completing level:", error);
    }
  };
  //YouTube
  const onStateChange = (event) => {
    if (event.data === 1) {
      hasStartedWatchingRef.current = true;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (!playerRef.current || !selected?._id) return;

        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();

        setCurrent(currentTime);
        setRemainingTime(duration - currentTime);

        if (
          hasStartedWatchingRef.current &&
          !hasCompletedRef.current &&
          currentTime >= 1 &&
          duration > 0 &&
          duration - currentTime <= 60
        ) {
          completeLevel();
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  //toNextLevelQuiz
  const completeQuiz = async () => {
    if (
      selected?.type !== "quiz" ||
      !score ||
      score === "no score" ||
      !score.totalScore ||
      hasCompletedRef.current
    ) {
      return;
    }

    const percentage = (score.score / score.totalScore) * 100;

    if (percentage >= 50) {
      hasCompletedRef.current = true;

      try {
        await api.post("/progress/complete", {
          courseId: id,
          levelId: selected._id,
          userId,
        });

        setNextCourseNumber(Number(selected.level) + 1);
      } catch (error) {
        hasCompletedRef.current = false;
        console.error("Error completing quiz:", error);
      }
    }
  };
  useEffect(() => {
    completeQuiz();
  }, [score, selected, id, userId]);

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E1DCC9] px-4 text-[#1F150C] dark:bg-[#1F150C] dark:text-[#E1DCC9]">
        <div className="rounded-2xl border border-[#A85E4D]/30 bg-[#F8F3EC] px-6 py-4 text-[#8F4A42] shadow-[0_10px_25px_rgba(31,21,12,0.08)] dark:border-[#E1DCC9]/15 dark:bg-[#20170E] dark:text-[#E1DCC9]">
          Course not found.
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#E1DCC9] text-[#1F150C] transition-colors dark:bg-[#1F150C] dark:text-[#E1DCC9]"
      dir="rtl"
    >
      <div className="w-full p-5">
        <div className="mt-1 gap-6 md:flex items-start">
          <div className="md:w-3/4 flex flex-col gap-4">
            {selected?.type == "video" ? (
              <div className="h-fit overflow-hidden rounded-[28px] border border-[#412D15]/15 bg-[#F8F3EC] shadow-[0_18px_35px_rgba(31,21,12,0.08)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E]">
                <div className="p-1">
                  <div className="rounded-3xl border border-[#412D15]/15 bg-[#1F150C] p-2 shadow-inner dark:border-[#E1DCC9]/10 dark:bg-[#1F150C]">
                    <div className="overflow-hidden rounded-[20px] bg-[#1F150C]">
                      <YouTube
                        key={selected?._id}
                        videoId={getYoutubeVideoId(selected?.video)}
                        onStateChange={onStateChange}
                        opts={{
                          height: "100%",
                          width: "100%",
                          playerVars: {
                            enablejsapi: 1,
                            origin: window.location.origin,
                          },
                        }}
                        onReady={(event) => {
                          playerRef.current = event.target;

                          event.target.seekTo(0, true);

                          hasCompletedRef.current = false;
                          hasStartedWatchingRef.current = false;

                          setCurrent(0);
                          setRemainingTime(event.target.getDuration());
                        }}
                        className="aspect-video w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-6 rounded-2xl bg-[#E1DCC9] p-5 dark:bg-[#2A1D10]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#412D15] px-3 py-1 text-xs font-semibold text-[#E1DCC9] dark:bg-[#E1DCC9] dark:text-[#1F150C]">
                        {selected?.title}
                      </span>
                      <span className="text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                        {selected?.duration}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-[#1F150C] dark:text-[#E1DCC9]">
                      {selected?.description || "Select a level to start"}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[#412D15]/80 dark:text-[#E1DCC9]/80">
                      In this level, you will learn practical fundamentals
                      through direct examples and real applications to help you
                      understand the content more deeply.
                    </p>
                  </div>{" "}
                </div>{" "}
              </div>
            ) : (
              <>
                <div className="flex h-[20vh] items-center justify-center overflow-hidden rounded-[28px] border border-[#412D15]/15 bg-[#F8F3EC] shadow-[0_18px_35px_rgba(31,21,12,0.08)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E] md:h-[70vh]">
                  {score == "no score" ? (
                    <Link
                      to={`/quiz/${selected.quizId}`}
                      className="cursor-pointer rounded-[2rem] border border-[#412D15]/15 bg-[#E1DCC9] p-10 text-center text-xl font-bold text-[#1F150C] shadow-[0_10px_20px_rgba(31,21,12,0.06)] dark:border-[#E1DCC9]/10 dark:bg-[#2A1D10] dark:text-[#E1DCC9]"
                    >
                      {selected.title} Quiz
                    </Link>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="rounded-[2rem] border border-[#412D15]/15 bg-[#E1DCC9] p-10 text-center text-xl font-bold text-[#1F150C] shadow-[0_10px_20px_rgba(31,21,12,0.06)] dark:border-[#E1DCC9]/10 dark:bg-[#2A1D10] dark:text-[#E1DCC9] md:text-4xl">
                          {score.score}/{score.totalScore}
                        </div>

                        {score.score < score.totalScore * (1 / 2) && (
                          <Link
                            to={`/quiz/${selected.quizId}`}
                            className="cursor-pointer rounded-[2rem] border border-[#412D15]/15 bg-[#E1DCC9] p-10 text-center text-xl font-bold text-[#1F150C] shadow-[0_10px_20px_rgba(31,21,12,0.06)] dark:border-[#E1DCC9]/10 dark:bg-[#2A1D10] dark:text-[#E1DCC9]"
                          >
                            Answer {selected.title} Quiz Again
                          </Link>
                        )}
                        <Link
                          to={`/myanswers/${selected.quizId}`}
                          className="cursor-pointer rounded-[2rem] border border-[#412D15]/15 bg-[#E1DCC9] p-10 text-center text-xl font-bold text-[#1F150C] shadow-[0_10px_20px_rgba(31,21,12,0.06)] dark:border-[#E1DCC9]/10 dark:bg-[#2A1D10] dark:text-[#E1DCC9]"
                        >
                          Show my Answers
                        </Link>
                      </div>{" "}
                    </>
                  )}
                </div>
              </>
            )}

            <div className="space-y-6 rounded-[28px] border border-[#412D15]/15 bg-[#F8F3EC] p-5 shadow-[0_18px_35px_rgba(31,21,12,0.08)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E]">
              <form onSubmit={addComment}>
                <div className="flex items-start gap-3">
                  <img
                    alt="user avatar"
                    src={avatar}
                    className="relative inline-block h-12 w-12 rounded-full border-2 border-[#F8F3EC] object-cover object-center dark:border-[#20170E]"
                  />
                  <div className="relative flex-1 px-1">
                    <input
                      autoComplete="off"
                      id="comment"
                      name="comment"
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="peer h-10 w-full border-b-2 border-[#412D15]/20 bg-transparent text-[#1F150C] placeholder-transparent focus:border-[#412D15] focus:outline-none dark:border-[#E1DCC9]/20 dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                      placeholder="Add Comment"
                    />
                    <label
                      htmlFor="comment"
                      className="absolute right-0 -top-3.5 text-sm text-[#412D15]/75 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#412D15]/60 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#412D15] dark:text-[#E1DCC9]/75 dark:peer-placeholder-shown:text-[#E1DCC9]/60 dark:peer-focus:text-[#E1DCC9]"
                    >
                      Add Comment
                    </label>

                    {commentText.trim().length > 0 && (
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="rounded-full px-4 py-2 text-sm font-medium text-[#412D15] transition-colors hover:bg-[#E1DCC9] dark:text-[#E1DCC9] dark:hover:bg-[#2A1D10]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-full bg-[#412D15] px-4 py-2 text-sm font-medium text-[#E1DCC9] transition-colors hover:bg-[#2D1F12] dark:bg-[#E1DCC9] dark:text-[#1F150C] dark:hover:bg-[#F8F3EC]"
                        >
                          Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              <div className="space-y-3">
                {comments.map((comment) => {
                  const isMyComment =
                    comment.userId?._id === userId || comment.userId === userId;

                  return (
                    <div
                      key={comment._id}
                      className="flex items-start gap-3 rounded-[20px] border border-[#412D15]/15 bg-[#E1DCC9] p-4 shadow-[0_8px_16px_rgba(31,21,12,0.04)] dark:border-[#E1DCC9]/10 dark:bg-[#2A1D10]"
                    >
                      <img
                        alt={comment.userId?.name || "User"}
                        src={comment.userId?.avatar || avatar}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-[#1F150C] dark:text-[#E1DCC9]">
                          {comment.userId?.name || "Anonymous"}
                        </span>

                        {editingId === comment._id ? (
                          <div className="mt-2 space-y-2">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full border-b-2 border-[#412D15]/40 bg-transparent py-1 text-sm text-[#1F150C] focus:border-[#412D15] focus:outline-none dark:border-[#E1DCC9]/40 dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="rounded-full px-3 py-1 text-xs text-[#412D15] hover:bg-[#F8F3EC] dark:text-[#E1DCC9] dark:hover:bg-[#20170E]"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(comment._id)}
                                className="rounded-full bg-[#412D15] px-3 py-1 text-xs text-[#E1DCC9] hover:bg-[#2D1F12] dark:bg-[#E1DCC9] dark:text-[#1F150C] dark:hover:bg-[#F8F3EC]"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-[#412D15]/80 dark:text-[#E1DCC9]/80">
                            {comment.text}
                          </p>
                        )}
                      </div>

                      {isMyComment && editingId !== comment._id && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(comment)}
                            className="text-xs text-[#412D15] hover:underline dark:text-[#E1DCC9]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(comment._id)}
                            className="text-xs text-[#A85E4D] hover:underline dark:text-[#E6B0A6]"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="md:h-[calc(100%-8rem)] md:flex flex-col justify-between md:w-1/4 gap-5">
            <div className="rounded-[28px] border border-[#412D15]/15 bg-[#F8F3EC]/85 p-6 shadow-[0_18px_35px_rgba(31,21,12,0.08)] backdrop-blur md:h-[30%] not-md:mt-4 dark:border-[#E1DCC9]/10 dark:bg-[#20170E]/90">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl flex gap-3 flex-row-reverse">
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1F150C] dark:text-[#E1DCC9]">
                    {course.name}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-[#412D15]/80 dark:text-[#E1DCC9]/80">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                    Progress
                  </span>
                  <span className="rounded-2xl border border-[#412D15]/15 bg-[#E1DCC9] px-4 py-3 text-sm font-medium text-[#1F150C] dark:border-[#E1DCC9]/10 dark:bg-[#2A1D10] dark:text-[#E1DCC9]">
                    {lastCompletedLevel?.level ?? 0}/{levels.length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E1DCC9] dark:bg-[#412D15]/50">
                  <div
                    className="h-2 rounded-full bg-[#412D15] transition-all duration-500 dark:bg-[#E1DCC9]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <aside className="overflow-hidden rounded-[28px] border border-[#412D15]/15 bg-[#F8F3EC] shadow-[0_18px_35px_rgba(31,21,12,0.08)] md:h-[67%] md:overflow-y-auto not-md:mt-5 dark:border-[#E1DCC9]/10 dark:bg-[#20170E]">
              <div className="border-b border-[#412D15]/15 px-5 py-4 dark:border-[#E1DCC9]/10">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                  Course content
                </h3>
              </div>

              <div className="flex-1 space-y-2 p-3">
                {levels.length > 0 ? (
                  levels.map((level) => (
                    <button
                      key={level._id}
                      disabled={level.level > nextCourseNumber ? true : false}
                      onClick={() => !level.locked && setSelected(level)}
                      className={`w-full rounded-2xl border p-4 text-right transition-all duration-200 ${
                        selected?._id === level._id
                          ? "border-[#412D15] bg-[#412D15] shadow-[0_12px_22px_rgba(31,21,12,0.18)]"
                          : level.level > nextCourseNumber
                            ? "cursor-not-allowed border-[#412D15]/10 bg-[#E1DCC9]/70 opacity-60"
                            : "cursor-pointer border-[#412D15]/15 bg-[#E1DCC9] hover:border-[#412D15]/30 hover:bg-[#E6DFC8]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                selected?._id === level._id
                                  ? "bg-[#E1DCC9] text-[#412D15]"
                                  : "bg-[#F8F3EC] text-[#412D15]"
                              }`}
                            >
                              {level.level}
                            </span>
                            <span
                              className={`text-sm font-semibold ${
                                selected?._id === level._id
                                  ? "text-[#E1DCC9]"
                                  : "text-[#1F150C]"
                              }`}
                            >
                              {level.title}
                            </span>
                          </div>
                          <p
                            className={`mt-2 text-xs leading-6 ${
                              selected?._id === level._id
                                ? "text-[#E1DCC9]/80"
                                : "text-[#412D15]/70"
                            }`}
                          >
                            {level.description}
                          </p>
                        </div>

                        <div>
                          {level.level > nextCourseNumber ? (
                            <FiLock
                              className={
                                selected?._id === level._id
                                  ? "text-[#E1DCC9]"
                                  : "text-[#412D15]/60"
                              }
                            />
                          ) : (
                            <svg
                              className={`h-4 w-4 ${
                                selected?._id === level._id
                                  ? "text-[#E1DCC9]"
                                  : "text-[#412D15]/60"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#412D15]/20 bg-[#E1DCC9] p-4 text-sm text-[#412D15]/70">
                    No levels available for this course yet.
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
