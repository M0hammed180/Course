import React, { useState, useEffect } from "react";
import heroPhoto from "./../../assets/heroimg.jpg";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Loading from "../Elements/Loading";
export default function Home() {
  const [course, setCourse] = useState(null);
  const [myPayments, setMyPayments] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [subject, setSubject] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/course`);
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
      const response = await axios.get(`http://localhost:3000/comment/`);
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
      await axios.post("http://localhost:3000/contact", {
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-cyan-50 text-slate-800 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <section className="hero min-h-[82vh] px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center">
          <div className="max-w-2xl rounded-3xl border border-white/20 bg-slate-950/45 p-8 text-white shadow-2xl backdrop-blur">
            <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
              Learn • Grow • Build
            </p>
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
              Learn Any Skill Online Easily
            </h1>
            <p className="mb-6 text-lg leading-8 text-slate-200">
              Discover high-quality lessons, track your progress, and join a
              modern learning experience made for every learner.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#courses"
                className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Get Started
              </a>
              <Link
                to="/courses"
                className="rounded-full border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
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
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
                Popular Picks
              </p>
              <h2 className="text-3xl font-bold">Latest Courses</h2>
            </div>
            <Link
              to="/courses"
              className="rounded-full bg-cyan-600 px-5 py-2.5 font-semibold text-white transition hover:bg-cyan-700"
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
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70 transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
                >
                  <img
                    src={c.photo}
                    alt="course"
                    className="h-44 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="mb-2 text-lg font-semibold">{c.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
              About Us
            </p>
            <h2 className="mb-4 text-3xl font-bold">
              A modern platform for practical learning
            </h2>
            <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
              Our platform provides high-quality courses in programming, design,
              and many other fields to help you grow your skills in a focused
              and inspiring environment.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center text-3xl font-bold">
            What Learners Say
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {comments.map((c) => (
              <div
                key={c._id}
                className="rounded-3xl bg-linear-to-br from-cyan-600 to-blue-600 p-8 text-white shadow-xl"
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
                    <span className="text-sm text-slate-500 dark:text-slate-400">
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
        <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-2 lg:p-10">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
                Contact Us
              </p>
              <h2 className="mb-6 text-3xl font-bold">
                We would love to hear from you
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800"
                />
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800"
                />
                <select
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option>Report Issue</option>
                  <option>General Inquiry</option>
                  <option>Course Problem</option>
                </select>
                <textarea
                  placeholder="Your Message"
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800"
                ></textarea>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700"
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
