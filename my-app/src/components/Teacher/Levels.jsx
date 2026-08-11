import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function Levels() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [levels, setLevels] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/course/${id}`);
        console.log(response.data.course);
        setCourse(response.data.course);
        console.log(response.data.levels);
        setLevels(response.data.levels);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-2xl">
        Loading Course Details...
      </div>
    );
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
      <div className="flex w-full h-[90vh] bg-slate-50 dark:bg-slate-950 dark:bg- p-4 gap-4 pt-24">
        <div className="w-[30%] flex flex-col gap-4 overflow-y-auto pr-2">
          {levels.map((level) => (
            <div
              key={level.id}
              className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer min-h-25"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                {level.title}
              </h3>
            </div>
          ))}
        </div>

        <div className="w-[70%] flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-xl shadow-inner border-2 border-dashed border-gray-300">
          <Link
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-16 rounded-2xl text-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            to={`/addlevel/${id}`}
          >
            addLevel
          </Link>
        </div>
      </div>
    </>
  );
}
