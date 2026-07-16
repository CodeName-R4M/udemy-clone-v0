
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Navbar from "./components/navbar"
import Footer from "./components/footer"
import Home from "./pages/home"
import Courses from "./pages/courses"
import CourseDetail from "./pages/course-detail"
import Login from "./pages/login"
import Register from "./pages/register"
import MyLearning from "./pages/my-learning"
import AdminDashboard from "./pages/admin-dashboard"
import InstructorDashboard from "./pages/instructor-dashboard"
import ManageCourse from "./pages/manage-course"
import QuizSettings from "./pages/quiz-settings"
import NotFound from "./pages/404"
import Cart from "./pages/cart"
import { CartProvider } from "./contexts/Cartcontext";
import Checkout from "./pages/checkout";
import CourseLearning from "./pages/course-learning";
import Certificate from "./pages/certificate";
import Profile from "./pages/profile";



function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/course-learning/:courseId" element={<CourseLearning />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-learning" element={<MyLearning />} />
              <Route path="/certificate/:courseId" element={<Certificate />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/instructor" element={<InstructorDashboard />} />
              <Route path="/instructor/courses/:id" element={<ManageCourse />} />
              <Route path="/quiz-settings/:courseId" element={<QuizSettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

