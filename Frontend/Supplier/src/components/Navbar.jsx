import React, { useState, useEffect } from 'react'; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check if userId exists in localStorage
        const userId = localStorage.getItem('userId');
        setIsLoggedIn(!!userId); // Convert to boolean
    }, []);

    const handleLogout = () => {
        toast.success("Logout Successfully")
        // Remove user-related data from localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdd');
        localStorage.removeItem('account');

        // Update state to reflect logout
        setIsLoggedIn(false);
        // Redirect to login page
        navigate('/login');
    };

    const navItems = isLoggedIn ? (
        <>
            <li>
                <a href="/" className="text-purple-800 hover:text-purple-600 font-medium">Home</a>
            </li>
            <li>
                <a href="/orders" className="text-purple-800 hover:text-purple-600 font-medium">Orders</a>
            </li>
            <li>
                <a href="/myaccount" className="text-purple-800 hover:text-purple-600 font-medium">My Account</a>
            </li>
            <li>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                    }}
                    className="text-purple-800 hover:text-purple-600 font-medium"
                >
                    Logout
                </a>
            </li>
        </>
    ) : (
        <>
            <li>
                <a href="/login" className="text-purple-800 hover:text-purple-600 font-medium">Login</a>
            </li>
            <li>
                <a href="/register" className="text-purple-800 hover:text-purple-600 font-medium">Sign Up</a>
            </li>
        </>
    );
    

    return (
        <div className='fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-100 to-purple-50 shadow-md'>
            <div className='max-w-screen-2xl container mx-auto px-4 md:px-8'>
                <div className="navbar">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-purple-800"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-white rounded-xl z-[1] mt-3 w-52 p-2 shadow-lg">
                                {navItems}
                            </ul>
                        </div>
                        <a href="/" className="text-3xl font-extrabold tracking-wide cursor-pointer flex items-center gap-2">
                            <span className="bg-gradient-to-r from-purple-700 to-purple-500 text-transparent bg-clip-text font-['Poppins']">
                                AuroraCart
                            </span>
                            <span className="text-sm font-medium text-purple-600">Supplier</span>
                        </a>
                    </div>
                    <div className="navbar-end">
                        <ul className="hidden lg:flex items-center space-x-8">
                            {navItems}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
