import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function BankApp() {
    const [currentSection, setCurrentSection] = useState("dashboard");
    const navigate = useNavigate();
    const name = localStorage.getItem("acc-name");

    useEffect(() => {
        const fetchBankDetails = async () => {
            const key = localStorage.getItem("key");
            const accountNumber = localStorage.getItem("acc-number");

            if (key && accountNumber) {
                try {
                    const response = await axios.post("http://localhost:8000/bank", {
                        key: key,
                        accountNumber: accountNumber,
                    });
                    const data = response.data;
                    localStorage.setItem("amount", data.amount);
                } catch (error) {
                    console.error("Error fetching bank details:", error);
                    handleLogout();
                }
            }
        };

        fetchBankDetails();
    }, [navigate]);

    const handleAddBalance = () => {
        alert("Add balance functionality is not implemented yet!");
    };

    const handleLogout = () => {
        localStorage.removeItem("acc-name");
        localStorage.removeItem("acc-number");
        localStorage.removeItem("amount");
        localStorage.removeItem("key");
        navigate("/login");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    if (!name) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to BankPAIX</h1>
                    <p className="text-gray-600 mb-6">Please login to access your account</p>
                    <button
                        onClick={handleLogin}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-zinc-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="px-6 py-4">
                    <h1 className="text-2xl font-bold text-blue-700">BankPAIX</h1>
                </div>
                <nav className="px-4 space-y-2">
                    <button
                        onClick={() => setCurrentSection("dashboard")}
                        className={`flex items-center px-4 py-2 w-full text-left rounded-md hover:bg-gray-100 ${
                            currentSection === "dashboard" ? "bg-blue-100 text-blue-700" : "text-gray-700"
                        }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setCurrentSection("addbalance")}
                        className={`flex items-center px-4 py-2 w-full text-left rounded-md hover:bg-gray-100 ${
                            currentSection === "addbalance" ? "bg-blue-100 text-blue-700" : "text-gray-700"
                        }`}
                    >
                        Add Balance
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-gray-700 px-4 py-2 w-full text-left rounded-md hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {currentSection === "dashboard" && (
                    <div>
                        {/* Dashboard Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold text-gray-800 m-6">Dashboard</h1>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-yellow-300 rounded-full"></div>
                                    <p className="text-sm font-medium">{name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Balance */}
                        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md w-96 h-48 m-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-medium">Main Balance</h2>
                                    <div className="flex items-center justify-between">
                                        <p className="text-3xl font-bold py-4">
                                            Tk {localStorage.getItem("amount")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-100 p-6">
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
                            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                                {/* Name Section */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-blue-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5.121 17.804A11.953 11.953 0 0112 15c2.28 0 4.396.633 6.122 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-lg font-medium text-gray-600">
                                            <span className="font-bold text-gray-800">Name:</span> {name}
                                        </p>
                                    </div>
                                </div>

                                {/* Account Number Section */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-blue-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 01-8 0M12 15v5m-6-6a6 6 0 1112 0v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-lg font-medium text-gray-600">
                                            <span className="font-bold text-gray-800">Account No:</span>{" "}
                                            {localStorage.getItem("acc-number")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentSection === "addbalance" && (
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Add Balance</h1>
                        <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
                            <p className="text-lg font-medium text-gray-600">Add money to your account:</p>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                className="mt-4 px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleAddBalance}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Add Balance
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
