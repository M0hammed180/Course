import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
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
        const response = await api.get(`/course/course/${id}`);
        const data = response.data.course;
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
      const response = await api.patch("/course/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
    <div className="min-h-1/2 bg-[#E1DCC9] px-4 py-10 text-[#1F150C] dark:bg-black dark:text-[#E1DCC9] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-stretch md:justify-center">
        <div className="w-full md:w-[52%]">
          <div className="h-full w-full rounded-3xl border border-[#412D15]/15 bg-[#F8F3EC] p-8 shadow-xl dark:border-[#E1DCC9]/10 dark:bg-[#20170E]">
            <h1 className="mb-6 text-center text-3xl font-semibold text-[#1F150C] dark:text-[#E1DCC9]">
              Edit Course
            </h1>

            <form onSubmit={handleEdit} className="space-y-4">
              <div className="flex items-start justify-center gap-2">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[#412D15] dark:text-[#E1DCC9]"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      id="name"
                      name="name"
                      className="mt-1 w-full rounded-md border border-[#412D15]/15 bg-[#FFFDF9] p-2 text-[#1F150C] focus:border-[#412D15] focus:outline-none focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-[#412D15] dark:text-[#E1DCC9]"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      id="price"
                      name="price"
                      className="mt-1 w-full rounded-md border border-[#412D15]/15 bg-[#FFFDF9] p-2 text-[#1F150C] focus:border-[#412D15] focus:outline-none focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium text-[#412D15] dark:text-[#E1DCC9]"
                    >
                      Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e)}
                      id="photo"
                      name="photo"
                      className="mt-1 w-full rounded-md border border-[#412D15]/15 bg-[#FFFDF9] p-2 text-[#1F150C] focus:border-[#412D15] focus:outline-none focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                    />
                  </div>
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
                      rows="3"
                      name="description"
                      className="mt-1 w-full rounded-md border border-[#412D15]/15 bg-[#FFFDF9] p-2 text-[#1F150C] focus:border-[#412D15] focus:outline-none focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#412D15] p-3 font-semibold text-[#E1DCC9] transition hover:bg-[#1F150C] dark:bg-[#E1DCC9] dark:text-[#1F150C] dark:hover:bg-[#F8F3EC]"
                >
                  Edit
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex w-full items-center justify-center md:w-[42%]">
          <div className="relative flex h-[360px] w-full max-w-[420px] items-center justify-center overflow-hidden rounded-[2rem] border border-dashed border-[#412D15]/30 bg-[#F5F0E8] shadow-[0_18px_35px_rgba(31,21,12,0.12)] dark:border-[#E1DCC9]/20 dark:bg-[#20170E]">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F150C]/60 via-transparent to-[#1F150C]/10" />
                <div className="absolute bottom-4 left-4 rounded-full bg-[#F8F3EC]/90 px-3 py-1.5 text-xs font-bold text-[#1F150C] shadow-sm backdrop-blur-sm dark:bg-[#1F150C]/80 dark:text-[#E1DCC9]">
                  Course Preview
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-center text-[#412D15]/70 dark:text-[#E1DCC9]/70">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#412D15]/20 bg-[#E1DCC9] text-2xl dark:border-[#E1DCC9]/20 dark:bg-[#412D15]">
                  ⤴
                </div>
                <div>
                  <p className="text-lg font-bold text-[#1F150C] dark:text-[#E1DCC9]">
                    Design Preview
                  </p>
                  <p className="text-sm">
                    Upload a course photo to preview it here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
