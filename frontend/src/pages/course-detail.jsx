import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/button';
import { apiClient } from '../client';
import {
  PlayCircle,
  Star,
  MoreVertical,
  CheckCircle,
  Video,
  Award,
  Infinity,
  MonitorSmartphone,
} from "lucide-react";



const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hoverRating, setHoverRating] = useState(0);
const { user: currentUser, token, refetchUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: '5', comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
const [myReview, setMyReview] = useState(null);
const [openMenu, setOpenMenu] = useState(null);
const [reviewFilter, setReviewFilter] = useState("helpful");

useEffect(() => {
  const load = async () => {
    try {
      const [courseData, lessonData, reviewData] = await Promise.all([
        apiClient.getCourse(id),
        apiClient.getLessons(id),
        apiClient.getCourseReviews(id).catch(() => []),
      ]);

      setCourse(courseData);
      setLessons(lessonData);
      setReviews(reviewData);

      if (currentUser) {
        const mine = reviewData.find(
          r => r.userId === currentUser.id
        );

        setMyReview(mine || null);

        if (mine) {
          setReviewForm({
            rating: String(mine.rating),
            comment: mine.comment,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  load();
}, [id, currentUser]);

  useEffect(() => {
    refetchUser();
  }, []);
const filteredReviews = [...reviews];

switch (reviewFilter) {
  case "highest":
    filteredReviews.sort((a, b) => b.rating - a.rating);
    break;

  case "lowest":
    filteredReviews.sort((a, b) => a.rating - b.rating);
    break;

  case "newest":
    filteredReviews.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    break;

  case "oldest":
    filteredReviews.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    break;

  case "helpful":
    filteredReviews.sort(
      (a, b) => (b.helpful || 0) - (a.helpful || 0)
    );
    break;
}
  const handleEnroll = async () => {
    if (!token) return;
    await apiClient.enrollInCourse(id);
    await refetchUser();
    const data = await apiClient.getCourse(id);
    setCourse(data);
  };


const handleDeleteReview = async (reviewId) => {
  if (!window.confirm("Delete this review?")) return;

  await apiClient.deleteCourseReview(id, reviewId);

  const [updatedCourse, updatedReviews] = await Promise.all([
    apiClient.getCourse(id),
    apiClient.getCourseReviews(id),
  ]);

  setCourse(updatedCourse);
  setReviews(updatedReviews);
  setOpenMenu(null);
};

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setReviewError('Please log in to leave a review.');
      return;
    }

    if (!course?.isEnrolled) {
      setReviewError('You need to enroll in this course before leaving a review.');
      return;
    }
    setIsSubmittingReview(true);
    setReviewError('');

try {
  const existingReview = reviews.find(
    (r) => r.userId === currentUser?.id
  );

  console.log("Existing Review:", existingReview);
  console.log("Current User:", currentUser);

  if (existingReview) {
    await apiClient.updateCourseReview(id, existingReview.id, {
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment,
    });
  } else {
    await apiClient.createCourseReview(id, {
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment,
    });
  }

  const [updatedCourse, reviewData] = await Promise.all([
    apiClient.getCourse(id),
    apiClient.getCourseReviews(id),
  ]);

  setCourse(updatedCourse);
  setReviews(reviewData);

  const mine = reviewData.find(
    (r) => r.userId === currentUser?.id
  );

  setMyReview(mine || null);

  if (mine) {
    setReviewForm({
      rating: String(mine.rating),
      comment: mine.comment,
    });
  } else {
    setReviewForm({
      rating: "5",
      comment: "",
    });
  }
} catch (error) {
  setReviewError(error.message);
} finally {
  setIsSubmittingReview(false);
}
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!course) return <div className="p-6">Course not found</div>;

  return (
    <>
    <div className="bg-gradient-to-r from-red-700 via-red-600 to-blue-700 text-white">
  <div className="max-w-7xl mx-auto px-6 py-14">

    <div className="grid lg:grid-cols-[1fr_300px] gap-10 items-start">

      {/* Left */}
      <div>
        <div className="inline-flex items-center bg-white/15 backdrop-blur px-4 py-1 rounded-full text-sm font-medium">
          Course
        </div>

        <h1 className="mt-5 text-4xl lg:text-5xl font-black leading-tight">
          {course.title}
        </h1>

        <p className="mt-5 text-lg text-white/90 leading-8 max-w-3xl">
          {course.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">

          {course.rating > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-yellow-300 text-lg">★</span>
              <span className="font-semibold">
                {course.rating}
              </span>
              <span className="text-white/80">
                ({course.reviews} Reviews)
              </span>
            </div>
          )}

          {course.instructorName && (
            <div>
              Instructor{" "}
              <span className="font-semibold">
                {course.instructorName}
              </span>
            </div>
          )}

        </div>
      </div>

      {/* Right */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">

        <p className="text-sm text-white/80 uppercase tracking-wider">
          Course Price
        </p>

        <h2 className="mt-2 text-5xl font-black">
          {course.price === 0 ? "FREE" : `₹${course.price}`}
        </h2>

        <div className="mt-6 space-y-3 text-sm">

          <div className="flex justify-between">
            <span className="text-white/75">Access</span>
            <span className="font-medium">Lifetime</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/75">Certificate</span>
            <span className="font-medium">Included</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/75">Level</span>
            <span className="font-medium">Beginner</span>
          </div>

        </div>

        <div className="mt-8">

          {course.isEnrolled ? (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => navigate(`/course-learning/${id}`)}
            >
              ✓ Already Enrolled
            </Button>
          ) : (
            <Button
  className="w-full bg-white !text-red-700 hover:bg-gray-100 font-bold"
  onClick={handleEnroll}
>
  Enroll Now
</Button>
          )}

        </div>

      </div>

    </div>

  </div>
</div>

<div className="bg-gray-50">
  <div className="max-w-7xl mx-auto px-6 py-12">

    <div className="grid lg:grid-cols-[1fr_320px] gap-10">

      {/* Left Content */}
      <div className="space-y-8">

        {/* What You'll Learn */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-3xl font-bold text-gray-900">
            What you'll learn
          </h2>

          <div className="mt-6 grid md:grid-cols-2 gap-4">

            {[
              "Build complete web applications from scratch",
              "Master modern JavaScript and ES6+",
              "Learn React, Node.js and databases",
              "Deploy production-ready applications",
              "Understand authentication & security",
              "Work on real-world projects",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3"
              >
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-blue text-white">
  <CheckCircle size={14} />
</div>

                <p className="text-gray-700">
                  {item}
                </p>
              </div>
            ))}

          </div>
        </div>

        {/* Course Description */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">

          <h2 className="text-3xl font-bold text-gray-900">
            Course Description
          </h2>

          <p className="mt-6 text-gray-700 leading-8">
            {course.description}
          </p>

        </div>

        {/* Course Includes */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">

          <h2 className="text-3xl font-bold text-gray-900">
            This Course Includes
          </h2>

          <div className="mt-6 grid sm:grid-cols-2 gap-5">

            <div className="flex items-center gap-3">
              <span className="text-2xl"><Video size={22} className="text-primary-blue" /></span>
              <span>Video Lessons</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl"><Award size={22} className="text-primary-blue" /></span>
              <span>Certificate of Completion</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl"><Infinity size={22} className="text-primary-blue" /></span>
              <span>Lifetime Access</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl"><MonitorSmartphone size={22} className="text-primary-blue" /></span>
              <span>Access on Any Device</span>
            </div>

          </div>

        </div>

      </div>

      {/* Right Sidebar */}
      <div>

        <div className="sticky top-8 bg-white rounded-2xl shadow-lg border overflow-hidden">

          {course.imageFileId && (
            <img
              src={`${import.meta.env.VITE_API_URL}/courses/${course.id}/image?v=${course.imageFileId}`}
              alt={course.title}
              className="w-full aspect-video object-cover"
            />
          )}

          <div className="p-6">

            <h3 className="text-3xl font-black text-primary-blue">
              {course.price === 0 ? "FREE" : `₹${course.price}`}
            </h3>

            <p className="mt-2 text-gray-500">
              One-time purchase. Lifetime access.
            </p>

            <div className="mt-6">

              {course.isEnrolled ? (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => navigate(`/course-learning/${id}`)}
                >
                  ✓ Already Enrolled
                </Button>
              ) : (
                <Button
                  className="w-full bg-primary-red hover:bg-red-700"
                  onClick={handleEnroll}
                >
                  Enroll Now
                </Button>
              )}

            </div>

            <hr className="my-6" />

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Access
                </span>

                <span className="font-semibold">
                  Lifetime
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Certificate
                </span>

                <span className="font-semibold">
                  Included
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Support
                </span>

                <span className="font-semibold">
                  Community
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Difficulty
                </span>

                <span className="font-semibold">
                  Beginner
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</div>

<div className="bg-white rounded-2xl shadow-sm border p-8">

  <div className="flex items-center justify-between">

    <h2 className="text-3xl font-bold text-gray-900">
      Course Content
    </h2>

    <span className="text-gray-500">
      {lessons.length} Lessons
    </span>

  </div>

  <div className="mt-8 divide-y rounded-xl border overflow-hidden">

    {lessons.length === 0 ? (

      <div className="p-8 text-center text-gray-500">
        No lessons added yet.
      </div>

    ) : (

      lessons.map((lesson, index) => (

        <div
          key={lesson.id}
          className="flex items-center justify-between p-5 hover:bg-gray-50 transition"
        >

          <div className="flex items-center gap-4">

            <div className="h-10 w-10 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold">
              {index + 1}
            </div>

            <div>

              <h3 className="font-semibold text-gray-900">
                {lesson.title}
              </h3>

              <p className="text-sm text-gray-500">
                {lesson.description || "Lesson"}
              </p>

            </div>

          </div>

          <div className="text-primary-red font-semibold">
            <PlayCircle size={22} className="text-primary-blue" />
          </div>

        </div>

      ))

    )}

  </div>

</div>

<div className="bg-white rounded-2xl shadow-sm border p-8">

  <h2 className="text-3xl font-bold text-gray-900">
    Meet your instructor
  </h2>

  <div className="mt-8 flex gap-6">

    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-600 to-blue-700 flex items-center justify-center text-white text-4xl font-black">
      {course.instructorName?.charAt(0).toUpperCase()}
    </div>

    <div className="flex-1">

      <h3 className="text-2xl font-bold">
        {course.instructorName}
      </h3>

      <p className="text-gray-500 mt-1">
        Course Instructor
      </p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary-blue">
            {course.rating || 0}
          </p>
          <p className="text-sm text-gray-500">
            Rating
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary-red">
            {course.reviews || 0}
          </p>
          <p className="text-sm text-gray-500">
            Reviews
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary-blue">
            {lessons.length}
          </p>
          <p className="text-sm text-gray-500">
            Lessons
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary-red">
            ♾
          </p>
          <p className="text-sm text-gray-500">
            Lifetime Access
          </p>
        </div>

      </div>

      <p className="mt-8 text-gray-700 leading-8">
        Learn from an experienced instructor through structured lessons,
        practical examples, and real-world projects designed to help you
        master the subject step by step.
      </p>

    </div>

  </div>

</div>

<div className="bg-white rounded-2xl shadow-sm border p-8">

  <div className="flex items-center justify-between">

    <div>
      <h2 className="text-3xl font-bold text-gray-900">
        Student Reviews
      </h2>

      <p className="text-gray-500 mt-2">
        What learners think about this course
      </p>
    </div>

    <div className="text-right">
      <div className="flex items-center justify-end gap-2">
        <Star
          size={24}
          className="fill-yellow-400 text-yellow-400"
        />

        <span className="text-3xl font-black">
          {course.rating || "0.0"}
        </span>
      </div>

      <p className="text-gray-500">
        {course.reviews || 0} Reviews
      </p>
    </div>

  </div>

  {course.isEnrolled  && (
    <form onSubmit={handleReviewSubmit} className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Leave a review</h3>
          <p className="text-sm text-gray-500">Share how this course helped you learn.</p>
        </div>

<div className="flex items-center gap-1">
  {[1, 2, 3, 4, 5].map((star) => (
    <button
      key={star}
      type="button"
      onClick={() =>
        setReviewForm({
          ...reviewForm,
          rating: String(star),
        })
      }
      onMouseEnter={() => setHoverRating(star)}
      onMouseLeave={() => setHoverRating(0)}
      className="transition-transform hover:scale-125"
    >
      <Star
        size={30}
        className={
          star <= (hoverRating || Number(reviewForm.rating))
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }
      />
    </button>
  ))}
</div>


      </div>

      <textarea
        rows={4}
        value={reviewForm.comment}
        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
        placeholder="Write a short review for the course"
        className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none"
        required
      />

      {reviewError && <p className="mt-3 text-sm text-red-600">{reviewError}</p>}

      <div className="mt-4 flex justify-end">
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmittingReview}>
          {isSubmittingReview
  ? "Saving..."
  : myReview
    ? "Update Review"
    : "Post Review"}
        </Button>
      </div>
    </form>
  )}
<div className="flex flex-wrap gap-3 mb-8">

  <button
    onClick={() => setReviewFilter("helpful")}
    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
      reviewFilter === "helpful"
        ? "bg-primary-blue text-white border-primary-blue shadow"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
    }`}
  >
    Most Helpful
  </button>

  <button
    onClick={() => setReviewFilter("highest")}
    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
      reviewFilter === "highest"
        ? "bg-primary-blue text-white border-primary-blue shadow"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
    }`}
  >
    Highest Rated
  </button>

  <button
    onClick={() => setReviewFilter("lowest")}
    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
      reviewFilter === "lowest"
        ? "bg-primary-blue text-white border-primary-blue shadow"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
    }`}
  >
    Lowest Rated
  </button>

  <button
    onClick={() => setReviewFilter("newest")}
    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
      reviewFilter === "newest"
        ? "bg-primary-blue text-white border-primary-blue shadow"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
    }`}
  >
    Newest
  </button>

  <button
    onClick={() => setReviewFilter("oldest")}
    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
      reviewFilter === "oldest"
        ? "bg-primary-blue text-white border-primary-blue shadow"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
    }`}
  >
    Oldest
  </button>

</div>

  <div className="mt-8 space-y-6">

    {reviews.length === 0 ? (
      <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
        No reviews yet. Be the first enrolled learner to share feedback.
      </div>
    ) : (
      filteredReviews.map((review) => (
        <div
          key={review.id}
          className="border rounded-xl p-6 hover:shadow-md transition"
        >

          <div className="flex justify-between items-start gap-4">

            <div className="flex items-center gap-4">

             <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-blue-700 text-white flex items-center justify-center font-bold text-lg">
  {review.userName?.charAt(0).toUpperCase() || 'S'}
</div>

              <div>

               <h3 className="font-semibold">
  {review.userName}
</h3>

                <div className="flex gap-1 mt-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>

              </div>

            </div>

            <div className="flex items-center gap-2">

  <div className="text-right">

  <p className="text-gray-400 text-sm">
    {new Date(
      review.updatedAt || review.createdAt
    ).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}
    {" • "}
    {new Date(
      review.updatedAt || review.createdAt
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </p>

  {review.updatedAt && (
    <span className="text-xs text-blue-600 font-medium">
      Edited
    </span>
  )}

</div>

  {(currentUser?.role === "admin" ||
    (currentUser?.role === "instructor" &&
      course.instructorId === currentUser?.id)) && (

    <div className="relative">

      <button
        onClick={() =>
          setOpenMenu(
            openMenu === review.id
              ? null
              : review.id
          )
        }
        className="p-1 rounded hover:bg-gray-100"
      >
        <MoreVertical size={18} />
      </button>

      {openMenu === review.id && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20">

          <button
            onClick={() =>
              handleDeleteReview(review.id)
            }
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Delete Review
          </button>

        </div>
      )}

    </div>
  )}

</div>

          </div>

          <p className="mt-5 text-gray-700 leading-7">
            {review.comment}
          </p>

        </div>
      ))
    )}

  </div>

</div>



</>
  );
};

export default CourseDetail;
