import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import registerBg from './assets/loginbg.jpg';
import { API } from './config';

function Register() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        usertype: 'supplier',
    });
    const [accountNumber, setAccountNumber] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

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
        const { fullname, email, password, usertype } = formData;

        // Validate input
        if (!fullname || !email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        const requestBody = {
            name: fullname,
            email: email,
            password: password,
            user_type: usertype.toLowerCase(),
        };

        try {
            const response = await fetch(`${API}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                setAccountNumber(data.account_number);
                setIsRegistered(true);
                toast.success('Registration successful! Please save your account number.');
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else {
                toast.error(`Registration failed: ${data.message}`);
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    const toggleForm = () => {
        navigate('/login');
    };

    return (
        <>
            <ToastContainer />
            <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 font-['Poppins']">
                <Navbar />
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mt-40">
                        <div className="bg-white py-8 px-10 shadow-xl rounded-2xl sm:px-12">
                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                <h2 className="text-center text-3xl font-bold leading-9 tracking-tight bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                                    Create Supplier Account
                                </h2>
                            </div>

                            {isRegistered && accountNumber ? (
                                <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
                                    <h3 className="text-xl font-semibold text-purple-800">Registration Successful!</h3>
                                    <p className="mt-3 text-sm text-purple-600">Your account number is:</p>
                                    <p className="mt-2 text-2xl font-bold text-purple-700 font-mono">{accountNumber}</p>
                                    <p className="mt-4 text-sm text-purple-600">Please save this number. You will need it for logging in.</p>
                                    <p className="mt-2 text-sm text-purple-500">Redirecting to login page in 5 seconds...</p>
                                </div>
                            ) : (
                                <div className="mt-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label htmlFor="fullname" className="block text-sm font-medium leading-6 text-purple-900">
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
                                                    className="block w-full rounded-lg border-0 py-2.5 px-4 text-white shadow-sm ring-1 ring-inset ring-purple-200 placeholder:text-purple-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 font-medium"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                        </div>

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
                                                    className="block w-full rounded-lg border-0 py-2.5 px-4 text-white shadow-sm ring-1 ring-inset ring-purple-200 placeholder:text-purple-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 font-medium"
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
                                                    minLength={6}
                                                    className="block w-full rounded-lg border-0 py-2.5 px-4 text-white shadow-sm ring-1 ring-inset ring-purple-200 placeholder:text-purple-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 font-medium"
                                                    placeholder="Enter your password"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <button
                                                type="submit"
                                                className="flex w-full justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-3 text-sm font-semibold leading-6 text-white shadow-lg hover:from-purple-700 hover:to-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                                            >
                                                Create Account
                                            </button>
                                        </div>
                                    </form>

                                    <p className="mt-8 text-center text-sm text-purple-600">
                                        Already have an account?{' '}
                                        <button
                                            onClick={toggleForm}
                                            className="font-semibold leading-6 text-purple-700 hover:text-purple-500 transition-colors duration-200"
                                        >
                                            Login here
                                        </button>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;