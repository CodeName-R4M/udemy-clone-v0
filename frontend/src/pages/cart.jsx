import { useCart } from "../contexts/Cartcontext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/button";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

const { refetchUser } = useAuth();

useEffect(() => {
  refetchUser();
}, []);
  const total = cart.reduce(
    (sum, course) => sum + Number(course.price),
    0
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="mb-8">

  <button
    onClick={() => navigate(-1)}
    className="text-primary-blue font-semibold hover:underline mb-4"
  >
    ← Back
  </button>

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    <h1 className="text-3xl md:text-4xl font-black">
      Shopping Cart
    </h1>

    <Link
      to="/courses"
      className="text-primary-red font-semibold hover:underline"
    >
      + Continue Shopping
    </Link>

  </div>

</div>
        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow border p-8 md:p-16 text-center">

            <div className="text-6xl mb-6">🛒</div>

            <h2 className="text-2xl font-bold">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-3">
              Check your enrolled courses or browse more courses.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link to="/my-learning">
                <Button>
                  My Learning
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline">
                  Browse Courses
                </Button>
              </Link>
            </div>

          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Cart Items */}

            <div className="lg:col-span-2 space-y-6">

              {cart.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow border overflow-hidden"
                >

                  <div className="flex flex-col md:flex-row">

                    {/* Image */}

                    <div className="md:w-72 h-48 md:h-auto bg-gray-200 flex-shrink-0">

                      {course.imageFileId ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}/courses/${course.id}/image?v=${course.imageFileId}`}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-primary-red to-primary-blue flex items-center justify-center text-white font-bold text-xl">
                          Course
                        </div>
                      )}

                    </div>

                    {/* Details */}

                    <div className="flex-1 p-6 flex flex-col">

                      <h2 className="text-xl font-bold">
                        {course.title}
                      </h2>

                      <p className="text-gray-500 mt-3 line-clamp-3">
                        {course.description}
                      </p>

                      <div className="mt-4 text-sm text-gray-400 flex flex-wrap gap-4">
                        <span>🎥 Video Course</span>
                        <span>♾ Lifetime Access</span>
                      </div>

                      <div className="mt-auto pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                        <button
                          onClick={() =>
                            removeFromCart(course.id)
                          }
                          className="text-red-600 font-semibold hover:underline text-left"
                        >
                          Remove
                        </button>

                        <h3 className="text-3xl font-black text-primary-blue">
                          ₹{course.price}
                        </h3>

                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>



            {/* Checkout */}

            <div>

              <div className="bg-white rounded-2xl shadow border p-6 lg:sticky lg:top-24">

                <p className="text-gray-500 uppercase font-semibold tracking-wide">
                  Total
                </p>

                <h2 className="text-5xl font-black mt-2">
                  ₹{total}
                </h2>
<div className="mt-8 space-y-3">

  <Link to="/courses" className="block">
    <Button
      variant="outline"
      className="w-full"
    >
      + Add Another Course
    </Button>
  </Link>

<Button
  className="w-full"
  onClick={() => navigate("/checkout")}
>
  Proceed to Checkout
</Button>

</div>
                <p className="text-center text-gray-500 text-sm mt-4">
                  Secure checkout powered by Razorpay
                </p>

                <hr className="my-8" />

                <div className="space-y-4">

                  <div className="flex justify-between">
                    <span>Courses</span>
                    <span>{cart.length}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>₹0</span>
                  </div>

                  <div className="flex justify-between text-xl font-bold border-t pt-4">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;