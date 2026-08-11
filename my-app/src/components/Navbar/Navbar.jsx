import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../Redux/userSlice";

export default function Navbar({ theme, toggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logOut = () => {
    dispatch(logout());
    navigate("/login");
  };
  const { isAuthenticated } = useSelector((state) => state.user);
  const { role } = useSelector((state) => state.user);
  const { userId } = useSelector((state) => state.user);

  const navLinkClass =
    "rounded-full px-3 py-2 text-sm font-medium transition hover:bg-cyan-500/10 hover:text-cyan-500";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur ${theme === "dark" ? "border-slate-800 bg-slate-900/80 text-slate-100" : "border-slate-200 bg-white/80 text-slate-700"}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-cyan-500"
        >
          Online
        </Link>

        <nav className="flex items-center gap-2">
          <Link className={navLinkClass} to="/">
            Home
          </Link>
          <Link className={navLinkClass} to={`/purchased/${userId}`}>
            Purchased
          </Link>
          {role === "teacher" ? (
            <>
              <Link className={navLinkClass} to="/courses">
                Courses
              </Link>
              <Link className={navLinkClass} to="/mycourses">
                My Courses
              </Link>
              <Link className={navLinkClass} to="/add">
                Add Course
              </Link>
            </>
          ) : (
            <Link className={navLinkClass} to="/courses">
              Courses
            </Link>
          )}
          {isAuthenticated === true ? (
            <button
              onClick={logOut}
              className={`${navLinkClass} cursor-pointer`}
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
          <button
            onClick={toggleTheme}
            className="ml-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-600 transition hover:bg-cyan-500/20 dark:text-cyan-300"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}
