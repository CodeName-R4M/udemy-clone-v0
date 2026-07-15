import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/Cartcontext";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-black text-primary-red whitespace-nowrap"
          onClick={() => setMobileMenuOpen(false)}
        >
          ADS <span className="text-primary-blue">Learning</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-gray-700 font-medium">
          <Link to="/courses" className="hover:text-primary-red transition">
            Courses
          </Link>

          {user?.role === "instructor" && (
            <Link to="/instructor" className="hover:text-primary-red transition">
              Instructor
            </Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-primary-red transition">
              Admin
            </Link>
          )}
        </div>

        {/* Desktop Search & Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search for anything..."
                className="w-full rounded-full border border-gray-300 pl-12 pr-5 py-3 outline-none focus:border-primary-blue focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative hover:text-primary-red transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-red text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
          
          {/* Auth Buttons */}
          {user ? (
            <>
              <Link
                to="/my-learning"
                className="hover:text-primary-red font-medium transition"
              >
                My Learning
              </Link>
              <div className="w-10 h-10 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold shadow">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg border border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white transition"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-lg bg-primary-red text-white hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4">
          {/* Search on Mobile */}
          <div className="relative w-full">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-full rounded-full border border-gray-300 pl-12 pr-5 py-3 outline-none focus:border-primary-blue focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {/* Cart Link */}
          <Link
            to="/cart"
            className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary-red font-medium transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingCart size={20} />
            Cart
            {cart.length > 0 && (
              <span className="bg-primary-red text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Navigation Links */}
          <Link
            to="/courses"
            className="block py-2 text-gray-700 hover:text-primary-red font-medium transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Courses
          </Link>

          {user?.role === "instructor" && (
            <Link
              to="/instructor"
              className="block py-2 text-gray-700 hover:text-primary-red font-medium transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Instructor
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="block py-2 text-gray-700 hover:text-primary-red font-medium transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/my-learning"
                className="block py-2 text-gray-700 hover:text-primary-red font-medium transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Learning
              </Link>
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold shadow">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-5 py-3 rounded-lg border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                className="px-5 py-3 rounded-lg border border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white text-center font-medium transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-5 py-3 rounded-lg bg-primary-red text-white hover:opacity-90 text-center font-medium transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
