import { useState, useEffect } from "react";
import Button from "../components/button";
import CourseCard from "../components/course-card";
import { apiClient } from "../client";
import {
  Search,
  GraduationCap,
  BriefcaseBusiness,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [enrolledIds, setEnrolledIds] = useState([]);
const [search, setSearch] = useState("");

  const navigate = useNavigate();

useEffect(() => {
  apiClient.getCourses().then((data) => setCourses(data));

  if (localStorage.getItem("token")) {
    apiClient.getMyEnrolledCourses().then((courses) => {
      setEnrolledIds(courses.map((c) => c.id));
    });
  }
}, []);
  const [courses, setCourses] = useState([]);

const filteredCourses = courses.filter((course) => {
  const q = search.toLowerCase();

  return (
    course.title.toLowerCase().includes(q) ||
    (course.description ?? "").toLowerCase().includes(q)
  );
});


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-red via-red-600 to-primary-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="bg-yellow-400 text-black font-semibold px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm">
              Learn from industry experts
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mt-6">
              Learn without limits
            </h1>

            <p className="text-sm sm:text-lg text-gray-200 mt-4 sm:mt-6 leading-7">
              Build in-demand skills with thousands of high-quality courses. Learn
              at your own pace and achieve your career goals with ADS Learning Hub.
            </p>

<div className="mt-6 sm:mt-8">
  <Button
    className="w-full sm:w-auto"
    onClick={() => navigate("/courses")}
  >
    Browse Courses
  </Button>
</div>

            <div className="grid grid-cols-3 gap-3 sm:gap-5 mt-8 sm:mt-12">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 sm:p-5 text-center">
                <h2 className="text-2xl sm:text-4xl font-bold">1000+</h2>
                <p className="text-xs sm:text-sm text-gray-200 mt-2">Students</p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4 sm:p-5 text-center">
                <h2 className="text-2xl sm:text-4xl font-bold">100+</h2>
                <p className="text-xs sm:text-sm text-gray-200 mt-2">Courses</p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4 sm:p-5 text-center">
                <h2 className="text-2xl sm:text-4xl font-bold">50+</h2>
                <p className="text-xs sm:text-sm text-gray-200 mt-2">Instructors</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-black text-2xl sm:text-3xl font-bold mb-5 sm:mb-6">
              What do you want to learn?
            </h2>

            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
<input
  type="text"
  placeholder="Search for anything..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full border rounded-full pl-11 pr-5 py-3 sm:py-4 text-black outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
/>
            </div>
          </div>
        </div>
      </section>

      <div className="-mt-1">
        <svg viewBox="0 0 1440 120" className="w-full fill-gray-50">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,53.3C1120,53,1280,75,1360,85.3L1440,96L1440,160L0,160Z" />
        </svg>
      </div>

      {/* Popular Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-primary-red font-semibold uppercase tracking-wider text-sm">
              Explore
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black mt-2">
              Popular Courses
            </h2>
            <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base">
              Discover our highest-rated courses and start learning today.
            </p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {filteredCourses.map((course) => (
            <CourseCard
    key={course.id}
    course={course}
    enrolled={enrolledIds.includes(course.id)}
/>
          ))}
        </div>
      </section>

      {/* Why Learn With Us */}
      <section className="bg-white py-12 sm:py-16 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
            Why Learn With ADS?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            <div className="hover:bg-primary-blue hover:text-white rounded-xl p-6 sm:p-8 shadow-sm transition">
              <div className="mb-4 sm:mb-5">
  <div className="w-16 h-16 rounded-2xl bg-primary-blue/10 flex items-center justify-center">
    <GraduationCap className="w-8 h-8 text-primary-blue" />
  </div>
</div>
              <h3 className="font-bold text-lg sm:text-xl">Learn at your own pace</h3>
              <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base">
                Lifetime access to your purchased courses.
              </p>
            </div>

            <div className="hover:bg-primary-blue hover:text-white rounded-xl p-6 sm:p-8 shadow-sm transition">
              <div className="w-16 h-16 rounded-2xl bg-primary-blue/10 flex items-center justify-center">
                <BriefcaseBusiness className="w-8 h-8 text-primary-blue" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl">Career-focused content</h3>
              <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base">
                Practical skills designed for today's jobs.
              </p>
            </div>

            <div className="hover:bg-primary-blue hover:text-white rounded-xl p-6 sm:p-8 shadow-sm transition">
              <div className="w-16 h-16 rounded-2xl bg-primary-blue/10 flex items-center justify-center">
                <BadgeCheck className="w-8 h-8 text-primary-blue" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl">Certificates</h3>
              <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base">
                Showcase your skills with certificates after completion.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
