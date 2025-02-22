import React, { useState } from 'react';
import Navbar from './components/Navbar';
import loginBg from './assets/loginbg.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/auth/login', {
                email: loginData.email,
                password: loginData.password,
            });

            const { user } = response.data;
            
            if (user.user_type !== 'admin') {
                toast.error('Access denied. Admin access only.');
                return;
            }

            localStorage.setItem('userId', user._id);
            localStorage.setItem('name', user.name);
            localStorage.setItem('user_type', user.user_type);
            
            toast.success('Login successful!');
            setTimeout(() => navigate('/'), 1000);
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <ToastContainer />
            <div
                className="relative min-h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${loginBg})` }}
            >
                <Navbar />
                <div className="flex flex-1 flex-col justify-center px-6 py-20 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mt-32">
                        <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                    Sign in to Admin Dashboard
                                </h2>
                            </div>

                            <div className="mt-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Email address
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                value={loginData.email}
                                                onChange={handleChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                            Password
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="current-password"
                                                required
                                                value={loginData.password}
                                                onChange={handleChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-md bg-amber-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                                        >
                                            Sign in
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;