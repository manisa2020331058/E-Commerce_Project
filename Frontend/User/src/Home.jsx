import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Productlist from './components/Productlist';
import Footer from './components/Footer';
import BankAccountDialog from './components/BankAccountDialog';

function Home() {
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const isAdd = localStorage.getItem('isAdd') === 'true';
        const name = localStorage.getItem("name");
        const userId = localStorage.getItem('userId');
        const userType = localStorage.getItem('user_type');
        
        if (!userId || (userType !== 'buyer' && userType !== 'user')) {
            navigate('/login');
            return;
        }

        if (!isAdd && name) {
            setIsDialogOpen(true);
        }
        
        if (name) {
            setUserName(name);
        }
    }, [navigate]);

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                            Welcome to AuroraCart
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl">
                            Your premier destination for secure online shopping
                        </p>
                        {userName && (
                            <p className="mt-2 text-purple-200">
                                Welcome back, {userName}!
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Featured Products Carousel */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Featured Products
                </h2>
                <Carousel />
            </div>

            {/* Product Lists */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="space-y-16">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            New Arrivals
                        </h2>
                        <Productlist />
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            Popular Items
                        </h2>
                        <Productlist />
                    </section>
                </div>
            </div>

            <Footer />

            {/* Bank Account Dialog */}
            {isDialogOpen && (
                <BankAccountDialog 
                    isOpen={isDialogOpen} 
                    onClose={handleDialogClose}
                />
            )}
        </div>
    );
}

export default Home;
