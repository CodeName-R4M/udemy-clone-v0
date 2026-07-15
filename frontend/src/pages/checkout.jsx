import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/Cartcontext";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import { apiClient } from "../client";


const Checkout = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

const total = cart.reduce(
  (sum, c) => sum + Number(c.price),
  0
);

const handlePayment = async () => {
  try {
    // Free checkout
    if (total === 0) {
      await apiClient.freeCheckout(cart.map(c => c.id));
const courses = await apiClient.getMyEnrolledCourses();

localStorage.setItem(
  "myLearningCourses",
  JSON.stringify(courses)
);
      setPaymentSuccess(true);
      clearCart();
      navigate("/my-learning", { replace: true });
      return;
    }

    // Paid checkout
    const order = await apiClient.createOrder({
      amount: total,
      courses: cart.map(c => c.id),
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "ADS Learning Hub",
      description: "Course Purchase",
      order_id: order.id,

      handler: async (response) => {
        try {
          await apiClient.verifyPayment({
            ...response,
            courses: cart.map(c => c.id),
          });
const courses = await apiClient.getMyEnrolledCourses();

localStorage.setItem(
  "myLearningCourses",
  JSON.stringify(courses)
);
          setPaymentSuccess(true);
          clearCart();

          navigate("/my-learning", {
            replace: true,
          });
        } catch (err) {
          console.error(err);
          alert("Payment verification failed.");
        }
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error(response.error);
      alert("Payment failed. Please try again.");
    });

    rzp.open();
  } catch (err) {
    console.error(err);
    alert("Unable to start payment.");
  }
};

  if (cart.length === 0 && !paymentSuccess) {
    return <Navigate to="/cart" replace />;
  }

if (!user) {
  return (
    <div className="max-w-xl mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold">
        Login Required
      </h1>

      <p className="mt-4 text-gray-600">
        Please login or create an account to complete your purchase.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Button
          onClick={() =>
            navigate("/login", {
              state: {
                from: "/checkout",
              },
            })
          }
        >
          Login
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            navigate("/register", {
              state: {
                from: "/checkout",
              },
            })
          }
        >
          Register
        </Button>
      </div>
    </div>
  );
}

  return (
    <div className="bg-gray-50 min-h-screen py-10">
  <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

    {/* Left */}

    <div className="lg:col-span-2 bg-white rounded-2xl shadow p-8">

      <h1 className="text-4xl font-black">
        Checkout
      </h1>

      <p className="text-gray-500 mt-2">
        Review your order before payment.
      </p>

      <div className="mt-8 space-y-6">

        {cart.map(course => (

          <div
            key={course.id}
            className="flex gap-5 border-b pb-5"
          >

            <img
              src={`${import.meta.env.VITE_API_URL}/courses/${course.id}/image?v=${course.imageFileId}`}
              className="w-44 h-28 rounded-lg object-cover"
            />

            <div className="flex-1">

              <h2 className="font-bold text-xl">
                {course.title}
              </h2>

              <p className="text-gray-500 mt-2">
                {course.description}
              </p>

            </div>

            <h3 className="font-bold text-2xl">
              ₹{course.price}
            </h3>

          </div>

        ))}

      </div>

    </div>

    {/* Right */}

    <div>

      <div className="bg-white rounded-2xl shadow p-8 sticky top-24">

        <h2 className="text-2xl font-bold">
          Order Summary
        </h2>

        <div className="mt-6 space-y-4">

          <div className="flex justify-between">
            <span>Courses</span>
            <span>{cart.length}</span>
          </div>
        
          <div className="flex justify-between">
            <span>Total</span>
            <span className="font-bold">
              ₹{total}
            </span>
          </div>

        </div>

        <Button
          className="w-full mt-8"
          onClick={handlePayment}
        >
          Pay ₹{total}
        </Button>

      </div>

    </div>

  </div>
</div>
  );
};

export default Checkout;