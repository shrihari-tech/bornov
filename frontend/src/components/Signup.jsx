import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, MailOutlined, LockOutlined, ArrowRightOutlined, LoginOutlined } from '@ant-design/icons';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        axios.post('http://localhost:5000/user/register', formData)
            .then((response) => {
                console.log('User registered successfully:', response.data);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            })
            .catch((error) => {
                console.error('Error registering user:', error);
                setError(error.response?.data?.message || 'Registration failed. Please try again.');
                setLoading(false);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <UserOutlined className="text-white text-3xl" />
                    </div>
                </div>
                
                <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Create Account</h2>
                <p className="mb-8 text-center text-gray-600">Join our community and start sharing your thoughts</p>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                        <p className="text-sm">Registration successful! Redirecting to login...</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <UserOutlined className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="relative">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MailOutlined className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="relative">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <LockOutlined className="text-gray-400" />
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading || success}
                        className={`w-full px-4 py-3 flex items-center justify-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium text-center transition-all duration-200 ${(loading || success) ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </>
                        ) : success ? (
                            <>Success!</>
                        ) : (
                            <>
                                Create Account <ArrowRightOutlined className="ml-2" />
                            </>
                        )}
                    </button>
                </form>
                
                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full mt-6 px-4 py-3 text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-4 focus:ring-green-100 font-medium flex items-center justify-center transition-all duration-200"
                    >
                        <LoginOutlined className="mr-2" /> Sign In to Your Account
                    </button>
                </div>
                
                <p className="mt-8 text-xs text-center text-gray-500">
                    By signing up, you'll create a free account and agree to our <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;