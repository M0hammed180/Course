import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../Redux/userSlice";
import { FiMoon, FiSun } from "react-icons/fi";

export default function Navbar({ theme, toggleTheme }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const logOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  const { role, isAuthenticated, avatar, userName } = useSelector(
    (state) => state.user,
  );
  const defaultAvatar = "/default-avatar.svg";
  const avatarSrc = avatar || defaultAvatar;
  const handleAvatarError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = defaultAvatar;
  };

  const [menu, setMenu] = useState(false);
  const [sideBar, setSideBar] = useState(false);

  const navLinkClass =
    "rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-[#412D15]/10 hover:text-[#412D15] dark:hover:bg-[#E1DCC9]/10 dark:hover:text-[#E1DCC9]";

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isAuthenticated && (
        <>
          {" "}
          <header
            className={`sticky top-0 z-40 border-b backdrop-blur-xl ${theme === "dark" ? "border-[#E1DCC9]/10 bg-[#1F150C]/90 text-[#E1DCC9]" : "border-[#412D15]/15 bg-[#F8F3EC]/30 text-[#1F150C]"}`}
          >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <Link
                to="/"
                className={`flex cursor-pointer items-center gap-2 text-lg font-semibold tracking-tight ${theme === "dark" ? "text-[#E1DCC9]" : "text-[#412D15]"}`}
              >
                <span>Online</span>
              </Link>

              <nav className="hidden items-center justify-center gap-2 md:flex">
                <Link
                  className={`${navLinkClass}${isActive("/") ? " bg-[#412D15] text-[#E1DCC9] dark:bg-[#E1DCC9] dark:text-[#1F150C]" : ""}`}
                  to="/"
                >
                  {role == "student" ? "Home" : "Dashboard"}
                </Link>

                {role == "student" && (
                  <Link
                    className={`${navLinkClass}${isActive("/courses") ? " bg-[#412D15] text-[#E1DCC9] dark:bg-[#E1DCC9] dark:text-[#1F150C]" : ""}`}
                    to="/courses"
                  >
                    Courses
                  </Link>
                )}
                {role == "student" ? (
                  <Link
                    className={`${navLinkClass}${isActive("/purchased") ? " bg-[#412D15] text-[#E1DCC9] dark:bg-[#E1DCC9] dark:text-[#1F150C]" : ""}`}
                    to="/purchased"
                  >
                    My Courses
                  </Link>
                ) : (
                  <Link
                    className={`${navLinkClass}${isActive("/mycourses") ? " bg-[#412D15] text-[#E1DCC9] dark:bg-[#E1DCC9] dark:text-[#1F150C]" : ""}`}
                    to="/mycourses"
                  >
                    My Courses
                  </Link>
                )}
              </nav>

              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={toggleTheme}
                  className="rounded-full bg-[#412D15] px-3 py-2 text-base text-[#E1DCC9] transition hover:bg-[#2D1F12] dark:bg-[#E1DCC9] dark:text-[#1F150C] dark:hover:bg-[#F8F3EC]"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <FiSun /> : <FiMoon />}
                </button>

                <button
                  onClick={() => setMenu(!menu)}
                  className="inline-flex items-center justify-center rounded-full border border-[#412D15]/20 bg-[#412D15]/10 p-2 text-[#412D15] transition hover:bg-[#412D15]/15 dark:border-[#E1DCC9]/10 dark:bg-[#E1DCC9]/10 dark:text-[#E1DCC9] md:hidden"
                  aria-label="Toggle menu"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="h-5 w-5"
                  >
                    {menu ? (
                      <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
                    ) : (
                      <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z"></path>
                    )}
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setSideBar(!sideBar)}
                  className="inline-flex items-center justify-center rounded-full border border-[#412D15]/15 bg-[#F8F3EC] p-0.5 transition hover:scale-105 dark:border-[#E1DCC9]/10 dark:bg-[#20170E]"
                  aria-label="Open sidebar"
                >
                  <img
                    alt="user"
                    src={avatarSrc}
                    onError={handleAvatarError}
                    className="relative inline-block h-9 w-9 rounded-full border-2 border-[#F8F3EC] object-cover object-center shadow-sm cursor-pointer dark:border-[#20170E]"
                  />
                </button>
              </div>
            </div>

            <nav
              className={`${menu ? "flex" : "hidden"} flex-col gap-2 border-t border-[#412D15]/15 bg-[#F8F3EC]/90 px-4 pb-4 pt-3 md:hidden ${theme === "dark" ? "border-[#E1DCC9]/10 bg-[#1F150C]/90" : ""}`}
            >
              <Link
                className={`${navLinkClass}${isActive("/") ? " bg-[#412D15] text-[#E1DCC9] dark:bg-[#E1DCC9] dark:text-[#1F150C]" : ""}`}
                to="/"
                onClick={() => setMenu(false)}
              >
                Home
              </Link>

              {role == "student" && (
                <Link
                  className={`${navLinkClass}${isActive("/courses") ? " bg-[#412D15] text-[#E1DCC9] dark:bg-[#E1DCC9] dark:text-[#1F150C]" : ""}`}
                  to="/courses"
                  onClick={() => setMenu(false)}
                >
                  Courses
                </Link>
              )}
              {role == "student" ? (
                <Link
                  className={`${navLinkClass}${isActive("/purchased") ? " bg-[#412D15] text-[#E1DCC9] dark:bg-[#E1DCC9] dark:text-[#1F150C]" : ""}`}
                  to="/purchased"
                  onClick={() => setMenu(false)}
                >
                  My Courses
                </Link>
              ) : (
                <Link
                  className={`${navLinkClass}${isActive("/mycourses") ? " bg-[#412D15] text-[#E1DCC9] dark:bg-[#E1DCC9] dark:text-[#1F150C]" : ""}`}
                  to="/mycourses"
                  onClick={() => setMenu(false)}
                >
                  My Courses
                </Link>
              )}
            </nav>
          </header>
          <div
            onClick={() => setSideBar(false)}
            className={`fixed inset-0 z-50 ${sideBar ? "" : "pointer-events-none"}`}
            // aria-hidden={!sideBar}
          >
            <div
              // onClick={(event) => event.stopPropagation()}
              className={`fixed right-0 top-0 flex h-screen w-full max-w-[20rem] flex-col border bg-[#F8F3EC]/30 backdrop-blur-2xl p-4 shadow-2xl transition-transform duration-300 ease-out ${sideBar ? "translate-x-0" : "translate-x-full"} ${theme === "dark" ? "border-[#E1DCC9]/10 bg-[#1F150C] text-[#E1DCC9]" : "border-[#412D15]/15 text-[#1F150C]"}`}
            >
              <div className="mb-2 p-4"></div>
              <nav className="flex min-w-60 flex-col gap-1 p-2 text-base font-normal text-inherit">
                <Link
                  to="/edit"
                  className="flex items-center justify-start gap-3 rounded-full px-3 py-2 transition-colors hover:bg-[#412D15]/10 hover:text-[#412D15] dark:hover:bg-[#E1DCC9]/10 dark:hover:text-[#E1DCC9]"
                >
                  <img
                    alt="user"
                    src={avatarSrc}
                    onError={handleAvatarError}
                    className="relative inline-block h-12 w-12 rounded-full border-2 border-[#F8F3EC] object-cover object-center hover:z-10 focus:z-10 dark:border-[#20170E]"
                  />
                  <p className="text-md font-medium text-[#1F150C] dark:text-[#E1DCC9]">
                    {userName}
                  </p>
                </Link>

                {role == "student" && (
                  <Link
                    className={`${navLinkClass} hover:bg-[#412D15]/10`}
                    to="/purchased"
                  >
                    Purchased
                  </Link>
                )}

                {role === "teacher" && (
                  <>
                    <Link
                      className={`${navLinkClass} hover:bg-[#412D15]/10`}
                      to="/mycourses"
                    >
                      My Courses
                    </Link>
                    <Link
                      className={`${navLinkClass} hover:bg-[#412D15]/10`}
                      to="/add"
                    >
                      Add Course
                    </Link>
                  </>
                )}

                {isAuthenticated === true ? (
                  <button
                    onClick={logOut}
                    className={`${navLinkClass} w-full cursor-pointer justify-start text-left md:flex`}
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      className={`${navLinkClass} hover:bg-[#412D15]/10`}
                      to="/login"
                    >
                      Login
                    </Link>
                    <Link
                      className={`${navLinkClass} hover:bg-[#412D15]/10`}
                      to="/register"
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
