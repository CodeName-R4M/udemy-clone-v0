
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Button from '../components/button';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const { register } = useAuth();
  const navigate = useNavigate();
const [isSubmitting, setIsSubmitting] = useState(false);
const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmitting) return;

  setIsSubmitting(true);
  setError("");

  try {
    const redirectTo = location.state?.from || "/";
    await register(email, password, name);
    navigate(redirectTo, { replace: true });
  } catch (err) {
    setError(err.message || "Registration failed.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary-red">Create Account</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-bold text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:border-primary-red focus:outline-none"
            required
          />
        </div>
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
<Button
  type="submit"
  className="w-full"
  disabled={isSubmitting}
>
  {isSubmitting ? "Registering..." : "Register"}
</Button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Already have an account? <Link to="/login" className="text-primary-blue hover:underline font-bold">Login</Link>
      </p>
    </div>
  );
};

export default Register;
