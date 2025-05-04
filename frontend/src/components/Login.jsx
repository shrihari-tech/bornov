import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MailOutlined, LockOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        axios.post('http://localhost:5000/user/login', formData)
            .then((response) => {
                // console.log('User logged in successfully:', response.data);
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('user', response.data.userId);

                setTimeout(() => {
                    navigate('/home');
                }, 500);
            })
            .catch((error) => {
                console.error('Error logging in:', error);
                setError(error.response?.data?.message || 'Failed to login. Please check your credentials.');
                setLoading(false);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <LoginOutlined className="text-white text-3xl" />
                    </div>
                </div>
                
                <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
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
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-3 flex items-center justify-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium text-center transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LoginOutlined className="mr-2" /> Sign In
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
                            <span className="px-2 bg-white text-gray-500">New to our platform?</span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => navigate('/')}
                        className="w-full mt-6 px-4 py-3 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium flex items-center justify-center transition-all duration-200"
                    >
                        <UserAddOutlined className="mr-2" /> Create an Account
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default Login;