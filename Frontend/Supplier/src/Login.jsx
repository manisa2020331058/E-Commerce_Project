import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const toggleForm = () => {
        navigate('/register');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:8000/auth/login', {
                email: formData.email,
                password: formData.password,
            });

            const { _id, isAdd, name, email, account_number, user_type } = data.user;

            // Only allow supplier login
            if (user_type !== 'supplier') {
                toast.error('This login is only for suppliers. Please use the appropriate login page.');
                return;
            }
            
            // Save user data to local storage
            localStorage.setItem('userId', _id);
            localStorage.setItem('name', name);
            localStorage.setItem('email', email);
            localStorage.setItem('isAdd', isAdd);
            localStorage.setItem('account', account_number);
            
            toast.success('Login successful!');
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            toast.error("Login failed. Please check your credentials.");
            console.error("Error during login:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <ToastContainer />
            <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 font-['Poppins']">
                <Navbar />
                <div className="flex flex-1 flex-col justify-center px-6 py-20 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mt-32">
                        <div className="bg-white py-8 px-10 shadow-xl rounded-2xl sm:px-12">
                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                <h2 className="text-center text-3xl font-bold leading-9 tracking-tight bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                                    Sign in to Supplier Portal
                                </h2>
                            </div>

                            <div className="mt-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-purple-900">
                                            Email Address
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="block w-full rounded-lg border-0 py-2.5 px-4 text-purple-900 shadow-sm ring-1 ring-inset ring-purple-200 placeholder:text-purple-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 font-medium"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-purple-900">
                                            Password
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                className="block w-full rounded-lg border-0 py-2.5 px-4 text-purple-900 shadow-sm ring-1 ring-inset ring-purple-200 placeholder:text-purple-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 font-medium"
                                                placeholder="Enter your password"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-3 text-sm font-semibold leading-6 text-white shadow-lg hover:from-purple-700 hover:to-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                </form>

                                <p className="mt-8 text-center text-sm text-purple-600">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={toggleForm}
                                        className="font-semibold leading-6 text-purple-700 hover:text-purple-500 transition-colors duration-200"
                                    >
                                        Register here
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;