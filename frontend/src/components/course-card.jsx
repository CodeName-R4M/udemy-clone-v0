import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/Cartcontext";

const CourseCard = ({ course, enrolled }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

const handlePurchase = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (enrolled) {
    navigate("/my-learning");
    return;
  }

  addToCart(course);
  navigate("/cart");
};

  return (
    <Link
      key={course.id}
      to={`/courses/${course.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {course.imageFileId ? (
          <img
            src={`${import.meta.env.VITE_API_URL}/courses/${course.id}/image?v=${course.imageFileId}`}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-red to-primary-blue flex items-center justify-center text-white text-4xl font-black">
            ADS
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
            Bestseller
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-blue transition">
          {course.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">ADS Learning Hub</p>

        {/* Instructor */}
        <p className="text-gray-500 text-xs sm:text-sm mt-2">
          {course.instructorName || "Instructor"}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-3">
          <span className="font-bold text-yellow-700 text-sm">
            {course.rating || "4.8"}
          </span>
          <div className="text-yellow-500 text-sm">★★★★★</div>
          <span className="text-gray-500 text-xs sm:text-sm">
            ({course.reviews || 120})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 sm:gap-3 mt-4">
          <span className="text-xl sm:text-2xl font-bold">₹{course.price}</span>
          <span className="text-gray-400 line-through text-sm sm:text-base">
            ₹{Math.round(course.price * 1.6)}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-5 sm:mt-6 flex gap-2 sm:gap-3">
          {enrolled ? (
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate("/my-learning");
    }}
    className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg"
  >
    ✓ Enrolled
  </button>
) : (
  <button
    onClick={handlePurchase}
    className="flex-1 bg-primary-red hover:bg-red-700 text-white font-semibold py-3 rounded-lg"
  >
    Add to Cart
  </button>
)}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/courses/${course.id}`);
            }}
            className="px-3 sm:px-4 border rounded-lg hover:bg-gray-100 transition text-sm"
          >
            View
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
