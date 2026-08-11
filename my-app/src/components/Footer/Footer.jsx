export default function Footer({ theme }) {
  return (
    <footer
      className={`border-t px-6 py-12 sm:px-8 lg:px-10 ${theme === "dark" ? "border-slate-800 bg-slate-900 text-slate-300" : "border-slate-200 bg-slate-950 text-slate-300"}`}
    >
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div>
          <h2 className="mb-4 text-2xl font-bold text-white">Learnify</h2>
          <p className="text-sm leading-7 text-slate-400">
            An online learning platform that helps you gain practical skills in
            programming, design, and more.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <a href="#" className="transition hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-white">
                Courses
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-white">Categories</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Web Development</li>
            <li>UI/UX Design</li>
            <li>Data Science</li>
            <li>Business</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-white">Subscribe</h3>
          <p className="mb-3 text-sm text-slate-400">
            Get the latest courses and updates.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-l-2xl bg-slate-800 px-3 py-2 text-sm text-white outline-none"
            />
            <button className="rounded-r-2xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Learnify. All rights reserved.
      </div>
    </footer>
  );
}
