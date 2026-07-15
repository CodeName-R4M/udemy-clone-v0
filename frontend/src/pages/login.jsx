
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link ,useLocation } from 'react-router-dom';
import Button from '../components/button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    await login(email, password);

    const redirectTo = location.state?.from || "/";
    navigate(redirectTo, { replace: true });
  } catch (err) {
    console.error(err);

    if (
      err instanceof TypeError ||
      err.message.includes("NetworkError") ||
      err.message.includes("Failed to fetch")
    ) {
      setError(
        "Unable to connect to the server. Please check your internet connection or try again later."
      );
      return;
    }

    try {
      const apiError = JSON.parse(err.message);
      setError(apiError.message || "Login failed.");
    } catch {
      setError(err.message || "Login failed.");
    }
  }
};
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary-red">Log in to your account</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-bold text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:border-primary-red focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-bold text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:border-primary-red focus:outline-none"
            required
          />
        </div>
        <Button type="submit" className="w-full">Log in</Button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Don't have an account? <Link to="/register" className="text-primary-blue hover:underline font-bold">Register</Link>
      </p>
    </div>
  );
};

export default Login;
