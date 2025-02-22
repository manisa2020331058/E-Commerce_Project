import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdBadge, MdPerson, MdEmail, MdAccountCircle, MdCreditCard } from 'react-icons/md';
import {
    UserCircleIcon,
    ShoppingBagIcon,
    HeartIcon,
    MapPinIcon,
    CreditCardIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import Navbar from './components/Navbar';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");  
    const tabs = [
        { name: 'Personal Info', icon: UserCircleIcon },
        { name: 'Payment Methods', icon: CreditCardIcon },
    ];
    useEffect(()=>{
        if(!userId){
            navigate("/login")
        }
    })

    return (
        <div className="w-64 bg-white shadow-md rounded-lg p-4">
            {tabs.map((tab) => (
                <button
                    key={tab.name}
                    className={`flex items-center w-full p-3 rounded-md mb-2 transition-all ${activeTab === tab.name
                        ? 'bg-blue-100 text-blue-600'
                        : 'hover:bg-gray-100'
                        }`}
                    onClick={() => setActiveTab(tab.name)}
                >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.name}
                </button>
            ))}
        </div>
    );
};

const MyAccount = () => {
    const [activeTab, setActiveTab] = useState('Personal Info');
    const [userInfo, setUserInfo] = useState({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+1 (555) 123-4567',
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [editFields, setEditFields] = useState({ ...userInfo });
    const [accountNo, setAccountNo] = useState(null); // State for storing accountNo

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditFields({ ...userInfo });
    };

    const handleSaveClick = () => {
        setUserInfo({ ...editFields });
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditFields({ ...editFields, [name]: value });
    };

    // Retrieve accountNo when "Payment Methods" tab is selected
    useEffect(() => {
        if (activeTab === 'Payment Methods') {
            const storedAccountNo = localStorage.getItem('accountNo');
            setAccountNo(storedAccountNo || 'No account information found.');
        }
    }, [activeTab]);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>
                <div className="flex flex-col md:flex-row gap-6">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="flex-grow">
                    {activeTab === 'Personal Info' && (
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Personal Information</h2>
                            <div className="space-y-4">
                            {/* ID */}
                            <div className="flex items-center text-gray-800">
                                <MdBadge className="text-blue-500 mr-3 text-xl" />
                                <span className="font-medium">ID:</span>
                                <span className="ml-2 text-gray-600">{localStorage.getItem("userId")}</span>
                            </div>

                            {/* Name */}
                            <div className="flex items-center text-gray-800">
                                <MdPerson className="text-green-500 mr-3 text-xl" />
                                <span className="font-medium">Name:</span>
                                <span className="ml-2 text-gray-600">{localStorage.getItem("name")}</span>
                            </div>

                            {/* Email */}
                            <div className="flex items-center text-gray-800">
                                <MdEmail className="text-red-500 mr-3 text-xl" />
                                <span className="font-medium">Email:</span>
                                <span className="ml-2 text-gray-600">{localStorage.getItem("email")}</span>
                            </div>

                            {/* User Type */}
                            <div className="flex items-center text-gray-800">
                                <MdAccountCircle className="text-yellow-500 mr-3 text-xl" />
                                <span className="font-medium">User Type:</span>
                                <span className="ml-2 text-gray-600 capitalize">Supplier</span>
                            </div>
                            </div>
                        </div>
                        )}

                        {activeTab === 'Payment Methods' && (
                            <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Payment Method</h2>
                            <div className="space-y-4">
                            {/* ID */}
                            <div className="flex items-center text-gray-800">
                                <MdCreditCard className="text-blue-500 mr-3 text-xl" />
                                <span className="font-medium">Added Method:</span>
                                <span className="ml-2 text-orange-600 font-bold">AuroraBank</span>
                            </div>

                            {/* Name */}
                            <div className="flex items-center text-gray-800">
                                <MdBadge className="text-green-500 mr-3 text-xl" />
                                <span className="font-medium">Account Number:</span>
                                <span className="ml-2 text-gray-600">{localStorage.getItem("acc-number")}</span>
                            </div>

                            
                            </div>
                        </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
