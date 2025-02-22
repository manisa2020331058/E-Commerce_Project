import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import registerBg from './assets/loginbg.jpg';

function Register() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        usertype: 'buyer', // Default to buyer
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullname, email, password } = formData;
        
        const requestBody = {
            name: fullname,
            email: email,
            password: password,
            user_type: 'buyer', // Always set as buyer for user registration
        };

        try {
            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Registration successful!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            toast.error('Registration failed. Please try again.');
        }
    };

    const toggleForm = () => {
        navigate('/login');
    };


    return (
        <>
            <ToastContainer />
            <div
                className="relative min-h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${registerBg})` }}
            >
                <Navbar />
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mt-40">
                        <div className="bg-white py-4 px-8 shadow-lg rounded-lg sm:px-10">
                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                
                                <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                    Create your account
                                </h2>
                            </div>

                            <div className="mt-4">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Full Name */}
                                    <div>
                                        <label htmlFor="fullname" className="block text-sm font-medium leading-6 text-gray-900">
                                            Full Name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="fullname"
                                                name="fullname"
                                                type="text"
                                                value={formData.fullname}
                                                onChange={handleChange}
                                                required
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Email address
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    

                                    {/* Password */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                            Password
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit" 
                                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Register
                                        </button>
                                    </div>
                                </form>

                                

                                <div className="mt-6 text-center">
                                   
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{' '}
                                        <button
                                            onClick={toggleForm }
                                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                                        >
                                            Sign In
                                        </button>
                                    </p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;