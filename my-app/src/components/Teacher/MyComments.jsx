import React, { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiMessageSquare,
  FiBookOpen,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../api";
import { useSelector } from "react-redux";
import Loading from "../Elements/Loading";

export default function MyComments() {
  const { userId } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // =========================
  // Get Comments
  // =========================

  const fetchComments = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/progress/comments/${userId}`);

      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchComments();
    }
  }, [userId]);

  // =========================
  // Start Edit
  // =========================

  const handleStartEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  // =========================
  // Cancel Edit
  // =========================

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // =========================
  // Save Edit
  // =========================

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return;

    try {
      await api.patch("/comment/", {
        commentId,
        text: editText,
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                text: editText,
                updated: true,
              }
            : comment,
        ),
      );

      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  // =========================
  // Delete
  // =========================

  const handleDelete = async (commentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/comment/${commentId}`);

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#E1DCC9] px-5 py-8 text-[#1F150C] dark:bg-[#1F150C] dark:text-[#E1DCC9] md:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E1DCC9] text-xl text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                <FiMessageSquare />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#000000] dark:text-[#E1DCC9]">
                  Students Comments
                </h1>

                <p className="mt-1 text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                  Manage comments from your courses
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="flex w-fit items-center gap-2 rounded-xl border border-[#412D15]/15 bg-[#F8F3EC] px-4 py-2.5 text-sm font-semibold text-[#412D15] transition hover:border-[#412D15]/30 hover:text-[#1F150C] dark:border-[#E1DCC9]/10 dark:bg-[#20170E] dark:text-[#E1DCC9] dark:hover:border-[#E1DCC9]/20 dark:hover:text-[#E1DCC9]"
          >
            <FiArrowRight />
            Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-[#412D15]/15 bg-[#F8F3EC] p-5 shadow-sm dark:border-[#E1DCC9]/10 dark:bg-[#20170E]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                  Total Comments
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#000000] dark:text-[#E1DCC9]">
                  {comments.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E1DCC9] text-xl text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                <FiMessageSquare />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#412D15]/15 bg-[#F8F3EC] p-5 shadow-sm dark:border-[#E1DCC9]/10 dark:bg-[#20170E]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                  Courses
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#000000] dark:text-[#E1DCC9]">
                  {new Set(comments.map((comment) => comment.courseId)).size}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E1DCC9] text-xl text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                <FiBookOpen />
              </div>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="rounded-3xl border border-[#412D15]/15 bg-[#F8F3EC] p-5 shadow-sm dark:border-[#E1DCC9]/10 dark:bg-[#20170E] md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#000000] dark:text-[#E1DCC9]">
                All Comments
              </h2>

              <p className="mt-1 text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                Comments from students on your courses
              </p>
            </div>

            <span className="rounded-full bg-[#E1DCC9] px-3 py-1.5 text-sm font-bold text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
              {comments.length}
            </span>
          </div>

          {/* Empty */}
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E1DCC9] text-2xl text-[#412D15] dark:bg-[#412D15] dark:text-[#E1DCC9]">
                <FiMessageSquare />
              </div>

              <h3 className="mt-4 font-bold text-[#000000] dark:text-[#E1DCC9]">
                No comments yet
              </h3>

              <p className="mt-1 text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                Students haven't commented on your courses yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl border border-[#412D15]/15 bg-[#FFFDF9] p-4 transition hover:border-[#412D15]/30 hover:shadow-sm dark:border-[#E1DCC9]/10 dark:bg-[#2A1D10] dark:hover:border-[#E1DCC9]/20"
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <img
                      src={comment.avatar}
                      alt={comment.userName}
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      {/* User */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-[#000000] dark:text-[#E1DCC9]">
                            {comment.userName}
                          </h3>

                          <div className="mt-1 flex items-center gap-2 text-xs text-[#412D15]/70 dark:text-[#E1DCC9]/75">
                            <FiBookOpen />

                            <span>{comment.courseName}</span>
                          </div>
                        </div>

                        {comment.updated && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                            Edited
                          </span>
                        )}
                      </div>

                      {/* Comment */}
                      {editingId === comment.id ? (
                        <div className="mt-4">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={4}
                            className="w-full resize-none rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] p-3 text-sm text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                            autoFocus
                          />

                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(comment.id)}
                              className="flex items-center gap-2 rounded-xl bg-[#412D15] px-4 py-2 text-sm font-semibold text-[#E1DCC9] transition hover:bg-[#1F150C]"
                            >
                              <FiCheck />
                              Save
                            </button>

                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center gap-2 rounded-xl bg-[#E1DCC9] px-4 py-2 text-sm font-semibold text-[#412D15] transition hover:bg-[#F1EADB] dark:bg-[#2A1D10] dark:text-[#E1DCC9] dark:hover:bg-[#3B2B1A]"
                            >
                              <FiX />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#412D15]/80 dark:text-[#E1DCC9]/80">
                          {comment.text}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-xs text-[#412D15]/60 dark:text-[#E1DCC9]/70">
                          <span>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>

                          <span>
                            {new Date(comment.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>

                        {editingId !== comment.id && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStartEdit(comment)}
                              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#412D15] transition hover:bg-[#E1DCC9] dark:text-[#E1DCC9] dark:hover:bg-[#412D15]"
                            >
                              <FiEdit2 />
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#8F3E3E] transition hover:bg-[#F1D9D9] dark:text-[#F9C7C7] dark:hover:bg-[#4A1E1E]"
                            >
                              <FiTrash2 />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
