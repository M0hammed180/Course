import React, { useState, useEffect } from "react";
import heroPhoto from "./../../assets/heroimg.jpg";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { useSelector } from "react-redux";
import Loading from "../Elements/Loading";
export default function Home() {
  const { userId } = useSelector((state) => state.user);
  const [course, setCourse] = useState(null);
  const [myPayments, setMyPayments] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [subject, setSubject] = useState(null);
  const [message, setMessage] = useState(null);
  const [achievements, setAchievements] = useState({});

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/progress/myachievements/${userId}`);
        setAchievements(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [userId]);

  const levelProgress =
    (achievements.completedLevels / achievements.totalLevels) * 100;

  const courseProgress =
    (achievements.completedCourses / achievements.totalCourses) * 100;

  const quizProgress =
    (achievements.quizScore / achievements.totalQuizScore) * 100;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/course`);
        setCourse(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, []);
  const fetchComments = async () => {
    try {
      const response = await api.get(`/comment/`);
      console.log(response.data.comments);

      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching Comments:", error);
    }
  };
  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/contact", {
        name,
        email,
        subject,
        message,
      });
      e.target.reset();
      alert("Message sent successfully");
    } catch (err) {
      alert("Failed to send");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="pt-24 text-center text-2xl text-red-500">
        Course not found!
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#E1DCC9] text-[#1F150C] transition-colors dark:bg-black dark:text-[#E1DCC9]">
      <section className="hero min-h-[82vh] px-6 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto flex min-h-[30vh] max-w-7xl flex-col justify-center">
          <div className="max-w-7xl rounded-3xl border border-[#E1DCC9]/20 bg-[#1F150C]/70 p-8 text-[#E1DCC9] shadow-2xl backdrop-blur">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#E1DCC9]">
                  Your Learning Progress
                </h2>

                <p className="mt-1 text-sm text-[#E1DCC9]/70">
                  Keep learning and complete your goals
                </p>
              </div>

              <Link
                to="/purchased"
                className="rounded-xl border border-[#E1DCC9]/20 bg-[#E1DCC9]/10 px-4 py-2 text-sm font-medium text-[#E1DCC9] transition hover:bg-[#E1DCC9]/20"
              >
                View All
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
              {/* Levels */}
              <div className="rounded-2xl bg-[#E1DCC9]/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#E1DCC9]/75">Levels</span>

                  <span className="font-bold text-[#E1DCC9]">
                    {levelProgress ? Math.round(levelProgress) + "%" : "0%"}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E1DCC9]/20">
                  <div
                    className="h-full rounded-full bg-[#E1DCC9] transition-all"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[#E1DCC9]/70">
                  {achievements.completedLevels} / {achievements.totalLevels}{" "}
                  completed
                </p>
              </div>

              {/* Courses */}
              <div className="rounded-2xl bg-[#E1DCC9]/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#E1DCC9]/75">Courses</span>

                  <span className="font-bold text-[#E1DCC9]">
                    {courseProgress ? Math.round(courseProgress) + "%" : "0%"}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E1DCC9]/20">
                  <div
                    className="h-full rounded-full bg-[#E1DCC9] transition-all"
                    style={{ width: `${courseProgress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[#E1DCC9]/70">
                  {achievements.completedCourses} / {achievements.totalCourses}{" "}
                  completed
                </p>
              </div>

              {/* Quiz */}
              <div className="rounded-2xl bg-[#E1DCC9]/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#E1DCC9]/75">Quiz Score</span>

                  <span className="font-bold text-[#E1DCC9]">
                    {quizProgress ? Math.round(quizProgress) + "%" : "0%"}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E1DCC9]/20">
                  <div
                    className="h-full rounded-full bg-[#E1DCC9] transition-all"
                    style={{ width: `${quizProgress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[#E1DCC9]/70">
                  {achievements.quizScore} / {achievements.totalQuizScore}{" "}
                  points
                </p>
              </div>

              {/* Comments */}
              <div className="rounded-2xl bg-[#E1DCC9]/10 p-4">
                <span className="text-sm text-[#E1DCC9]/75">Interaction</span>

                <p className="mt-2 text-3xl font-bold text-[#E1DCC9]">
                  {achievements.comments}
                </p>

                <p className="mt-1 text-xs text-[#E1DCC9]/70">
                  Comments written
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-center">
          <div className="max-w-2xl rounded-3xl border border-[#E1DCC9]/20 bg-[#1F150C]/70 p-8 text-[#E1DCC9] shadow-2xl backdrop-blur">
            <p className="mb-3 inline-flex rounded-full bg-[#E1DCC9]/10 px-3 py-1 text-sm font-medium text-[#E1DCC9]">
              Learn • Grow • Build
            </p>
            <h1 className="mb-4 text-4xl font-bold text-[#E1DCC9] sm:text-5xl">
              Learn Any Skill Online Easily
            </h1>
            <p className="mb-6 text-lg leading-8 text-[#E1DCC9]/80">
              Discover high-quality lessons, track your progress, and join a
              modern learning experience made for every learner.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#courses"
                className="rounded-full bg-[#E1DCC9] px-6 py-3 font-semibold text-[#1F150C] transition hover:bg-[#F5F0E8]"
              >
                Get Started
              </a>
              <Link
                to="/courses"
                className="rounded-full border border-[#E1DCC9]/60 px-6 py-3 font-semibold text-[#E1DCC9] transition hover:bg-[#E1DCC9]/10"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#412D15]">
                Popular Picks
              </p>
              <h2 className="text-3xl font-bold text-[#1F150C] dark:text-[#E1DCC9]">
                Latest Courses
              </h2>
            </div>
            <Link
              to="/courses"
              className="rounded-full bg-[#412D15] px-5 py-2.5 font-semibold text-[#E1DCC9] transition hover:bg-[#1F150C]"
            >
              See All
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {course
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3)
              .map((c) => (
                <div
                  key={c._id}
                  className="overflow-hidden rounded-3xl border border-[#412D15]/15 bg-[#F8F3EC] shadow-[0_20px_35px_rgba(31,21,12,0.08)] transition hover:-translate-y-1 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:shadow-none"
                >
                  <img
                    src={c.photo}
                    alt="course"
                    className="h-44 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="mb-2 text-lg font-semibold text-[#1F150C] dark:text-[#E1DCC9]">
                      {c.name}
                    </h3>
                    <p className="text-sm text-[#412D15]/75 dark:text-[#E1DCC9]/75">
                      {c.description}{" "}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <img
            src={heroPhoto}
            alt="online learning"
            className="h-105 w-full rounded-3xl object-cover shadow-xl"
          />
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#412D15]">
              About Us
            </p>
            <h2 className="mb-4 text-3xl font-bold text-[#1F150C] dark:text-[#E1DCC9]">
              A modern platform for practical learning
            </h2>
            <p className="text-lg leading-8 text-[#412D15]/75 dark:text-[#E1DCC9]/80">
              Our platform provides high-quality courses in programming, design,
              and many other fields to help you grow your skills in a focused
              and inspiring environment.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#1F150C] dark:text-[#E1DCC9]">
            What Learners Say
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {comments.map((c) => (
              <div
                key={c._id}
                className="rounded-3xl bg-gradient-to-br from-[#412D15] to-[#1F150C] p-8 text-[#E1DCC9] shadow-xl"
              >
                <p className="mb-6 text-lg leading-8">{c.text}</p>
                <div className="flex items-center gap-4">
                  <img
                    src={c.userId.avatar}
                    alt="student"
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{c.userId.name}</h4>
                    <span className="text-sm text-[#E1DCC9]/70">
                      {c.courseId.name} Course
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl border border-[#412D15]/15 bg-[#F8F3EC] p-8 shadow-xl dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] lg:grid-cols-2 lg:p-10">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#412D15] dark:text-[#E1DCC9]">
                Contact Us
              </p>
              <h2 className="mb-6 text-3xl font-bold text-[#1F150C] dark:text-[#E1DCC9]">
                We would love to hear from you
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-2xl border border-[#412D15]/15 bg-[#FFFDF9] p-3 text-[#1F150C] outline-none transition placeholder:text-[#412D15]/60 focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:placeholder:text-[#E1DCC9]/60 dark:focus:border-[#E1DCC9]"
                />
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  className="w-full rounded-2xl border border-[#412D15]/15 bg-[#FFFDF9] p-3 text-[#1F150C] outline-none transition placeholder:text-[#412D15]/60 focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:placeholder:text-[#E1DCC9]/60 dark:focus:border-[#E1DCC9]"
                />
                <select
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-2xl border border-[#412D15]/15 bg-[#FFFDF9] p-3 text-[#1F150C] outline-none transition focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:focus:border-[#E1DCC9]"
                >
                  <option>Report Issue</option>
                  <option>General Inquiry</option>
                  <option>Course Problem</option>
                </select>
                <textarea
                  placeholder="Your Message"
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="w-full rounded-2xl border border-[#412D15]/15 bg-[#FFFDF9] p-3 text-[#1F150C] outline-none transition placeholder:text-[#412D15]/60 focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 dark:border-[#E1DCC9]/10 dark:bg-[#1F150C] dark:text-[#E1DCC9] dark:placeholder:text-[#E1DCC9]/60 dark:focus:border-[#E1DCC9]"
                ></textarea>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#412D15] py-3 font-semibold text-[#E1DCC9] transition hover:bg-[#1F150C]"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984"
            alt="contact"
            className="h-105 w-full rounded-3xl object-cover"
          />
        </div>
      </section>
    </div>
  );
}
