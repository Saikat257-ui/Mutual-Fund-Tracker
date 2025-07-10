import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Alert } from '../components/ui';
import { login as loginApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginApi(formData.email, formData.password);
      login(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-8">
          <div className="mb-8">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>
          {error && <Alert type="error" message={error} />}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <Input
                label="Email address"
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <Button 
                type="submit" 
                isLoading={isLoading} 
                className="w-full shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
