import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("/default-avatar.svg");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    setAvatar(file || null);

    if (!file) {
      setPreview("/default-avatar.svg");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) {
      formData.append("photo", avatar);
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      navigate("/login");
      console.log("Success:", response.data.message);
    } catch (error) {
      if (error.response) {
        console.error("Login Failed:", error.response.data.error);
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
              Register
            </h1>

            <form
              onSubmit={handleRegister}
              className="space-y-4 flex flex-col justify-center items-center w-full"
            >
              <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100">
                <label htmlFor="avatar" className="cursor-pointer">
                  <img
                    src={preview}
                    alt="Avatar Preview"
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/default-avatar.svg";
                    }}
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
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      id="username"
                      name="username"
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2 text-slate-900 outline-none transition-colors duration-300 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setPhone(e.target.value)}
                      id="phone"
                      name="phone"
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2 text-slate-900 outline-none transition-colors duration-300 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      name="email"
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2 text-slate-900 outline-none transition-colors duration-300 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      name="password"
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2 text-slate-900 outline-none transition-colors duration-300 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              <div className=" flex justify-around items-center w-full">
                <select
                  id="role"
                  onChange={(e) => setRole(e.target.value)}
                  name="role"
                  className="mt-1 w-5/12 rounded-md border border-slate-300 bg-white p-2 text-slate-900 outline-none transition-colors duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="student" className="dark:bg-slate-800">
                    Student
                  </option>
                  <option value="teacher" className="dark:bg-slate-800">
                    Teacher
                  </option>
                </select>

                <button
                  type="submit"
                  className="w-5/12 rounded-2xl bg-cyan-600 p-3 font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-cyan-700 hover:underline dark:text-cyan-300"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
