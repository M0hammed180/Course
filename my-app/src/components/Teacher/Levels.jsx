import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import Loading from "../Elements/Loading";
import {
  FiSearch,
  FiImage,
  FiBellOff,
  FiSlash,
  FiFlag,
  FiTrash2,
  FiMail,
  FiPhone,
  FiPlus,
  FiX,
  FiPenTool,
  FiEdit,
  FiTrash,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

export default function Levels() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [course, setCourse] = useState(null);
  const [levels, setLevels] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/course/course/${id}`);
      console.log(response.data.course);
      setCourse(response.data.course);
      localStorage.setItem("levelsLength", response.data.course.levels + 1);
      console.log(response.data.levels);
      setLevels(response.data.levels);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course details:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const deleteLevel = async (levelId) => {
    setLoading(true);
    try {
      const response = await api.delete(`/level/${levelId}`);
      console.log({
        success: response.data.success,
        message: response.data.message,
      });
      fetchCourseDetails();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="mt-20 text-center text-2xl text-red-500 dark:text-red-400">
        Course not found!
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#E1DCC9] p-4 text-[#1F150C] dark:bg-[#1F150C] dark:text-[#E1DCC9] sm:p-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-5 text-3xl font-black text-[#1F150C] dark:text-[#E1DCC9]">
          Levels
        </h2>

        <div className="flex flex-wrap items-center justify-start gap-4 overflow-y-auto p-2 sm:p-5">
          {levels
            .sort((a, b) => a.level - b.level)
            .map((level) => (
              <div
                key={level._id}
                className="flex items-center justify-center gap-2 rounded-[1.25rem] border border-[#412D15]/15 bg-[#F8F3EC] p-4 shadow-[0_12px_25px_rgba(31,21,12,0.06)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E]"
              >
                <h3 className="text-base font-bold text-[#1F150C] dark:text-[#E1DCC9] sm:text-lg">
                  {level.level}- {level.title}
                </h3>
                <Link
                  to={`/editlevel/${level._id}`}
                  className="rounded-full bg-[#E1DCC9] p-2 text-[#412D15] transition hover:bg-[#F5F0E8] dark:bg-[#412D15] dark:text-[#E1DCC9] dark:hover:bg-[#2A1D10]"
                >
                  <FiEdit size={18} />
                </Link>
                <button
                  onClick={() => deleteLevel(level._id)}
                  className="cursor-pointer rounded-full bg-[#F1D9D9] p-2 text-[#8F3E3E] transition hover:bg-[#E9C4C4] dark:bg-[#4A1E1E] dark:text-[#F9C7C7] dark:hover:bg-[#5B2424]"
                >
                  <FiTrash size={18} />
                </button>
              </div>
            ))}

          <div className="flex min-h-[88px] items-center justify-center rounded-[1.25rem] border border-dashed border-[#412D15]/30 bg-[#F8F3EC] p-4 shadow-[0_12px_25px_rgba(31,21,12,0.05)] dark:border-[#E1DCC9]/20 dark:bg-[#20170E]">
            <Link
              to={`/addlevel/${id}`}
              className="flex items-center justify-center p-3 text-[#412D15] transition hover:text-[#1F150C] dark:text-[#E1DCC9] dark:hover:text-[#F8F3EC]"
            >
              <FiPlus size={40} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
