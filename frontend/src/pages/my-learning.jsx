import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "../client";
import { Trophy } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const MyLearning = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

useEffect(() => {
  if (!token) {
    navigate("/login");
    return;
  }
// Clear old cached data to avoid numeric ID issues
  localStorage.removeItem("myLearningCourses");

  apiClient.getMyEnrolledCourses().then((data) => {
    console.log("=======================AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA===================================");
    console.log(JSON.stringify(data, null, 2));
    setCourses(data);
    localStorage.setItem(
      "myLearningCourses",
      JSON.stringify(data)
    );
  });
}, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-red via-red-700 to-primary-blue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-black tracking-tight">
  My Learning
</h1>

<p className="mt-3 text-red-100 text-lg">
  Continue where you left off
</p>

<div className="mt-6 inline-flex items-center bg-white/15 backdrop-blur px-5 py-2 rounded-full">
  <span className="font-semibold">
    {courses.length} Course{courses.length !== 1 && "s"} Enrolled
  </span>
</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-16 text-center">
            <div className="text-7xl mb-6">📚</div>

            <h2 className="text-3xl font-bold">
              Start Learning Today
            </h2>

            <p className="text-gray-500 mt-3">
              You haven't enrolled in any courses yet.
            </p>

            <Link
              to="/courses"
              className="inline-block mt-8 px-8 py-3 bg-primary-red text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => {
  const progress =
    course.lessonsCount > 0
      ? Math.round(
          (course.completedLessons / course.lessonsCount) * 100
        )
      : 0;

  return (
    <div
      key={course.id}
      onClick={() => navigate(`/courses/${course.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/courses/${course.id}`);
        }
      }}
      className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition duration-300 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-200 overflow-hidden">
        {course.imageFileId ? (
          <img
            src={`${import.meta.env.VITE_API_URL}/courses/${course.id}/image?v=${course.imageFileId}`}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary-red to-primary-blue text-white text-5xl font-black">
            ADS
          </div>
        )}
      </div>

      <div className="p-5">
        <h2 className="font-bold text-lg leading-6 line-clamp-2">
          {course.title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {course.instructorName}
        </p>

        {/* Progress */}
        <div className="mt-4">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-blue transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>{progress}% complete</span>
            <span>
              {course.completedLessons}/{course.lessonsCount} lessons
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/course-learning/${course.id}`);
          }}
          className="mt-5 w-full py-2.5 rounded-lg bg-primary-blue text-white hover:bg-blue-700 transition"
        >
          {course.completedLessons === course.lessonsCount
            ? "Review Course"
            : "Resume Learning"}
        </button>

{course.lessonsCount > 0 &&
  course.completedLessons === course.lessonsCount &&
  course.quizPassed && (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/certificate/${course.id}`);
      }}
      className="w-full mt-3 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
    >
      <Trophy size={18} />
      View Certificate
    </button>
)}
      </div>
    </div>
  );
})}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;