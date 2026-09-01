import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../Elements/Loading";

export default function AddCourse() {
  const navigate = useNavigate();
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

  const handleAdd = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("teacherId", userId);
    formData.append("price", price);
    formData.append("description", description);
    if (photo) {
      formData.append("photo", photo);
    }

    setLoading(true);
    try {
      const response = await api.post("/course", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Success:", response.data.message);
      navigate(-1);
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
    <div className="min-h-screen bg-[#E1DCC9] px-4 py-10 text-[#1F150C] dark:bg-[#1F150C] dark:text-[#E1DCC9] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row">
        <div className="w-full md:w-1/2">
          <div className="w-full rounded-[1.75rem] border border-[#412D15]/15 bg-[#F8F3EC] p-5 shadow-[0_18px_35px_rgba(31,21,12,0.08)] dark:border-[#E1DCC9]/10 dark:bg-[#20170E] sm:p-8">
            <h1 className="mb-6 text-center text-3xl font-black text-[#1F150C] dark:text-[#E1DCC9]">
              Add Course
            </h1>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
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
                      onChange={(e) => setName(e.target.value)}
                      id="name"
                      name="name"
                      className="mt-1 w-full rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] p-3 text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
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
                      onChange={(e) => setPrice(e.target.value)}
                      id="price"
                      name="price"
                      className="mt-1 w-full rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] p-3 text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
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
                      className="mt-1 w-full rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] p-3 text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
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
                      onChange={(e) => setDescription(e.target.value)}
                      id="description"
                      rows="3"
                      name="description"
                      className="mt-1 w-full rounded-xl border border-[#412D15]/15 bg-[#FFFDF9] p-3 text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                    ></textarea>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#412D15] p-3 font-semibold text-[#E1DCC9] transition hover:bg-[#1F150C] dark:bg-[#E1DCC9] dark:text-[#1F150C] dark:hover:bg-[#F8F3EC]"
              >
                ADD
              </button>
            </form>
          </div>
        </div>

        <div className="flex w-full items-center justify-center md:w-1/2">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-60 w-full max-w-md rounded-[2rem] object-cover shadow-[0_18px_35px_rgba(31,21,12,0.12)]"
            />
          ) : (
            <div className="flex h-60 w-full max-w-md items-center justify-center rounded-[2rem] border border-dashed border-[#412D15]/30 bg-[#F5F0E8] text-[#412D15]/60 dark:border-[#E1DCC9]/20 dark:bg-[#20170E] dark:text-[#E1DCC9]/70">
              Course Preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
