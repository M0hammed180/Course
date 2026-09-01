import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../Redux/userSlice";

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    role,
    userId,
    isAuthenticated,
    avatar: avatarSlice,
    userName,
    phone: phoneSlice,
    email: emailSlice,
  } = useSelector((state) => state.user);

  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState(phoneSlice);
  const [email, setEmail] = useState(emailSlice);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(avatarSlice);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (e.target.files && e.target.files.length > 0) {
      setAvatar(file);
    } else {
      setAvatar(null);
    }

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("userId", userId);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) {
      formData.append("photo", avatar);
    }
    try {
      const response = await api.patch(
        "/user/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      dispatch(setUserData(response.data.user));
      navigate("/");
      console.log("Success:", response.data.message);
    } catch (error) {
      if (error.response) {
        console.error("Edited Failed:", error.response.data.error);
      } else {
        console.error("Network Error:", error.message);
      }
    }
  };

  return (
    <div>
      <div className="flex min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
        {/* Left Pane */}
        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h1 className="mb-6 text-center text-3xl font-semibold text-slate-800 dark:text-slate-100">
              My Profile
            </h1>

            <form
              onSubmit={handleEdit}
              className="space-y-4 flex flex-col justify-center items-center w-full"
            >
              <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100">
                <label htmlFor="avatar" className="cursor-pointer">
                  <img
                    src={preview}
                    alt="Avatar Preview"
                    className="h-full w-full object-cover"
                  />
                </label>{" "}
                <input
                  id="avatar"
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  hidden
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      id="username"
                      name="username"
                      className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <input
                      value={phone}
                      type="text"
                      onChange={(e) => setPhone(e.target.value)}
                      id="phone"
                      name="phone"
                      className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      name="email"
                      className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      name="password"
                      className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className=" flex justify-around items-center w-full">
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
      </div>
    </div>
  );
}
