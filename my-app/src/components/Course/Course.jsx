import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../Elements/Loading";
import { useSelector } from "react-redux";

export default function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [levels, setLevels] = useState([]);
  const [comments, setComments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const { role, userId, isAuthenticated, avatar, userName } = useSelector(
    (state) => state.user,
  );

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/course/course/${id}`,
      );
      setCourse(response.data.course);
      setLevels(response.data.levels || []);

      if (response.data.levels?.length > 0) {
        setSelected(response.data.levels[0]);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/comment/${id}`);
      setComments(response.data.comments || response.data || []);
    } catch (error) {
      console.error("Error fetching Comments:", error);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([fetchCourseDetails(), fetchComments()]);
      setLoading(false);
    };

    loadAllData();
  }, [id]);

  const handleCancel = () => {
    setCommentText("");
  };

  const addComment = async (e) => {
    e?.preventDefault();
    if (!commentText.trim()) return;

    try {
      await axios.post("http://localhost:3000/comment", {
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

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3000/comment/${commentId}`);
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
      await axios.patch(`http://localhost:3000/comment/`, {
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

  const progress =
    levels.length > 0 && selected?.level
      ? (selected.level / levels.length) * 100
      : 0;

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-700 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          Course not found.
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100"
      dir="rtl"
    >
      <div className="w-full p-5">
        <div className="mt-1 gap-6 md:flex items-start">
          {/* Main Video & Comments Section */}
          <div className="md:w-3/4 flex flex-col gap-4">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 h-fit">
              <div className="p-1">
                <div className="rounded-3xl border border-slate-200 bg-slate-950 p-2 shadow-inner dark:border-slate-800">
                  <div className="overflow-hidden rounded-[20px] bg-black">
                    <iframe
                      key={selected?._id}
                      src={getYoutubeEmbedUrl(selected?.video)}
                      allowFullScreen
                      className="aspect-video w-full object-cover"
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/70">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                      {selected?.title}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {selected?.duration}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-slate-800 dark:text-white">
                    {selected?.description || "Select a level to start"}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    In this level, you will learn practical fundamentals through
                    direct examples and real applications to help you understand
                    the content more deeply.
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Box */}
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 p-5 space-y-6">
              <form onSubmit={addComment}>
                <div className="flex items-start gap-3">
                  <img
                    alt="user avatar"
                    src={avatar}
                    className="relative inline-block h-12 w-12 rounded-full border-2 border-white object-cover object-center"
                  />
                  <div className="relative flex-1 px-1">
                    <input
                      autoComplete="off"
                      id="comment"
                      name="comment"
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 dark:text-white focus:outline-none focus:border-rose-600 bg-transparent"
                      placeholder="Add Comment"
                    />
                    <label
                      htmlFor="comment"
                      className="absolute right-0 -top-3.5 text-gray-600 dark:text-gray-200 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Add Comment
                    </label>

                    {commentText.trim().length > 0 && (
                      <div className="flex items-center justify-end gap-2 mt-3">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                        >
                          Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.map((comment) => {
                  const isMyComment =
                    comment.userId?._id === userId || comment.userId === userId;

                  return (
                    <div
                      key={comment._id}
                      className="flex items-start gap-3 p-4 rounded-[20px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <img
                        alt={comment.userId?.name || "User"}
                        src={comment.userId?.avatar || avatar}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                          {comment.userId?.name || "Anonymous"}
                        </span>

                        {editingId === comment._id ? (
                          <div className="mt-2 space-y-2">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full border-b-2 border-blue-500 bg-transparent py-1 text-sm text-gray-900 dark:text-white focus:outline-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-3 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(comment._id)}
                                className="px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-full"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {comment.text}
                          </p>
                        )}
                      </div>

                      {isMyComment && editingId !== comment._id && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(comment)}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(comment._id)}
                            className="text-xs text-rose-600 hover:underline"
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

          {/* Sidebar Section */}
          <div className="md:h-[calc(100%-8rem)] md:flex flex-col justify-between md:w-1/4 gap-5">
            <div className="rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 md:h-[30%] not-md:mt-4">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl flex gap-3 flex-row-reverse">
                  <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    {course.name}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Progress
                  </span>
                  <span className="font-medium rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                    {selected?.level ?? 0}/{levels.length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <aside className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:h-[67%] md:overflow-y-auto not-md:mt-5">
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Course content
                </h3>
              </div>

              <div className="flex-1 space-y-2 p-3">
                {levels.length > 0 ? (
                  levels.map((level) => (
                    <button
                      key={level._id}
                      onClick={() => !level.locked && setSelected(level)}
                      className={`w-full rounded-2xl border p-4 text-right transition-all duration-200 ${
                        selected?._id === level._id
                          ? "border-indigo-500 bg-indigo-600 shadow-lg shadow-indigo-900/20"
                          : level.locked
                            ? "cursor-not-allowed border-slate-200 bg-slate-100/70 opacity-60 dark:border-slate-700 dark:bg-slate-800/50"
                            : "cursor-pointer border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-slate-600 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                selected?._id === level._id
                                  ? "bg-white text-indigo-600"
                                  : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200"
                              }`}
                            >
                              {level.level}
                            </span>
                            <span
                              className={`text-sm font-semibold ${
                                selected?._id === level._id
                                  ? "text-white"
                                  : "text-slate-700 dark:text-slate-200"
                              }`}
                            >
                              {level.title}
                            </span>
                          </div>
                          <p
                            className={`mt-2 text-xs leading-6 ${
                              selected?._id === level._id
                                ? "text-indigo-100"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {level.description}
                          </p>
                        </div>

                        <div>
                          {level.locked ? (
                            <svg
                              className="h-4 w-4 text-slate-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2-2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className={`h-4 w-4 ${
                                selected?._id === level._id
                                  ? "text-white"
                                  : "text-slate-400"
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
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
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
