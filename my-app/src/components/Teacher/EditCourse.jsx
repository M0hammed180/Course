import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../Elements/Loading";

export default function EditCourse() {
  const { id } = useParams();
  const { userId } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/course/course/${id}`,
        );
        const data = response.data.course;
        console.log(data);
        setName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setPreview(data.photo);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);
  const handleEdit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("courseId", id);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    if (photo) {
      formData.append("photo", photo);
    }
    setLoading(true);
    try {
      const response = await axios.patch(
        "http://localhost:3000/course/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Success:", response.data.message);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error);
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
      <div className="flex flex-wrap min-h-1/2 bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
        {/* Left Pane */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h1 className="mb-6 text-center text-3xl font-semibold text-slate-800 dark:text-slate-100">
              Edit Course
            </h1>

            <form onSubmit={handleEdit} className="space-y-4">
              <div className="flex justify-center items-start gap-2">
                {/* Your form elements go here */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      id="name"
                      name="name"
                      className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      id="price"
                      name="price"
                      className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e)}
                      id="photo"
                      name="photo"
                      className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    />
                  </div>
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
                      rows="3"
                      name="description"
                      className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-cyan-600 p-3 font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                >
                  Edit
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center">
          {" "}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className=" h-60 w-80 rounded-4xl object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}
