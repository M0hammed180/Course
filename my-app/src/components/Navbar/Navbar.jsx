import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../Redux/userSlice";
import { FiSidebar } from "react-icons/fi";

export default function Navbar({ theme, toggleTheme }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const logOut = () => {
    dispatch(logout());
    navigate("/login");
  };
  const { role, userId, isAuthenticated, avatar, userName } = useSelector(
    (state) => state.user,
  );
  const [menu, setMenu] = useState(false);
  const [sideBar, setSideBar] = useState(false);

  const navLinkClass =
    "rounded-full px-3 py-2 text-s not-md:text-center font-medium transition hover:bg-cyan-500/10 hover:text-cyan-500 not-md:bg-cyan-500/10 not-md:text-cyan-500";

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b : backdrop-blur ${theme === "dark" ? "border-slate-800 bg-slate-900/80 text-slate-100" : "border-slate-200 bg-white/80 text-slate-700"}`}
      >
        <div className="mx-auto flex md:flex-row flex-col md:h-16 md:max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="w-full not-md:py-2 not-md:flex justify-between items-center transform transition-all duration-300 ">
            <button
              onClick={() => setSideBar(!sideBar)}
              className="text-xl font-semibold tracking-tight text-cyan-500 cursor-pointer flex items-center gap-1"
            >
              <FiSidebar size={18} /> Online
            </button>{" "}
            <button
              onClick={() => setMenu(!menu)}
              className="ml-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-600 transition hover:bg-cyan-500/20 dark:text-cyan-300 md:hidden"
            >
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                {menu ? (
                  <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"></path>
                ) : (
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
                )}
              </svg>
            </button>
          </div>

          <nav
            className={`${menu ? "not-md:hidden md:flex" : "flex"} md:flex-row flex-col gap-2 md:justify-end not-md:justify-center w-full md:visible not-md:mb-3  `}
            onClick={() => setMenu(true)}
          >
            <Link
              className={`${navLinkClass}${location.pathname == `/` && `text-cyan-500 bg-cyan-500/10`}`}
              to="/"
            >
              Home
            </Link>

            <Link
              className={`${navLinkClass}${location.pathname == `/courses` && `text-cyan-500 bg-cyan-500/10`}`}
              to="/courses"
            >
              Courses
            </Link>

            <button
              onClick={toggleTheme}
              className={`rounded-full px-3 py-2 text-s font-medium transition hover:bg-cyan-900/80 hover:text-cyan-500 cursor-pointer bg-cyan-700/50`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </nav>
        </div>
      </header>
      <div
        onClick={() => setSideBar(false)}
        className={`fixed ${sideBar ? "flex" : "hidden"}   flex-col bg-clip-border  backdrop-blur ${theme === "dark" ? "border-slate-800 bg-slate-900/80 text-slate-100" : "border-slate-200 bg-white/80 text-slate-700"} z-100 h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 `}
      >
        <div className="mb-2 p-4"></div>
        <nav className="flex flex-col gap-1 min-w-60 p-2 font-sans text-base font-normal dark:text-white text-gray-700">
          <Link
            to="/edit"
            className="flex justify-start items-center px-3 py-2 gap-3"
          >
            <img
              alt="user 5"
              src={avatar}
              className="relative inline-block h-12 w-12 rounded-full border-2 border-white object-cover object-center hover:z-10 focus:z-10"
            />
            <p className="text-md font-medium text-black dark:text-white">
              {userName}
            </p>
          </Link>
          <Link className={navLinkClass} to={`/purchased/${userId}`}>
            Purchased
          </Link>
          {role === "teacher" && (
            <>
              <Link className={navLinkClass} to="/mycourses">
                My Courses
              </Link>
              <Link className={navLinkClass} to="/add">
                Add Course
              </Link>
            </>
          )}
          {isAuthenticated === true ? (
            <button
              onClick={logOut}
              className={`${navLinkClass} cursor-pointer md:flex justify-start`}
            >
              Logout
            </button>
          ) : (
            <>
              <Link className={navLinkClass} to="/login">
                Login
              </Link>
              <Link className={navLinkClass} to="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
