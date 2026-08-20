import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
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
      const response = await axios.get(
        `http://localhost:3000/course/course/${id}`,
      );
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
      const response = await axios.delete(
        `http://localhost:3000/level/${levelId}`,
      );
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
      <div className="text-center mt-20 text-2xl text-red-500">
        Course not found!
      </div>
    );
  }
  return (
    <>
      <div className=" w-full  bg-slate-50 dark:bg-slate-950 p-4 gap-4 ">
        <h2 className="text-3xl font-bold">Levels</h2>

        <div className="w-full flex flex-wrap justify-start items-center gap-4 overflow-y-auto p-5">
          {levels
            .sort((a, b) => a.level - b.level)
            .map((level) => (
              <div
                key={level._id}
                className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors "
              >
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                  {level.level}- {level.title}
                </h3>
                <Link
                  to={`/editlevel/${level._id}`}
                  className=" text-blue-500 rounded-full p-2 bg-blue-300 mr-1 ml-3"
                >
                  <FiEdit size={20} />
                </Link>
                <button
                  onClick={() => deleteLevel(level._id)}
                  className=" cursor-pointer text-red-500 rounded-full p-2 bg-red-300 "
                >
                  <FiTrash size={20} />
                </button>
              </div>
            ))}
          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer min-h-25">
            <Link
              to={`/addlevel/${id}`}
              className="text-lg font-bold px-10 text-gray-700 dark:text-gray-100 flex gap-1 items-center"
            >
              <FiPlus size={50} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
