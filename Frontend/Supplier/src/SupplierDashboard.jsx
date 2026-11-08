import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import { API } from './config';

function SupplierDashboard() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        image: '',
        category: '',
        stock: ''
    });
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const supplierId = localStorage.getItem('userId');
            const response = await axios.get(`${API}/product/supplier/${supplierId}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'image' && value) {
            setPreviewImage(value);
        }
    };

    const validateProduct = () => {
        const { name, description, price, image, category, stock, originalPrice } = newProduct;
        if (!name || !description || !price || !image || !category || !stock || !originalPrice) {
            toast.error('Please fill in all fields');
            return false;
        }
        if (isNaN(price) || price <= 0) {
            toast.error('Please enter a valid price');
            return false;
        }
        if (isNaN(originalPrice) || originalPrice <= 0) {
            toast.error('Please enter a valid original price');
            return false;
        }
        if (isNaN(stock) || stock < 0) {
            toast.error('Please enter a valid stock quantity');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateProduct()) return;

        setLoading(true);
        try {
            const supplierId = localStorage.getItem('userId');
            const supplierName = localStorage.getItem('name');
            
            const productData = {
                name: newProduct.name,
                description: newProduct.description,
                supplier_id: supplierId,
                supplier_name: supplierName,
                price: Number(newProduct.price),
                originalPrice: Number(newProduct.originalPrice),
                image: newProduct.image,
                category: newProduct.category,
                stock: Number(newProduct.stock)
            };

            console.log('Sending product data:', productData);
            
            const response = await axios.post(      `${API}/product/add`, productData);

            toast.success('Product added successfully!');
            setProducts([...products, response.data.product]);
            setNewProduct({
                name: '',
                description: '',
                price: '',
                originalPrice: '',
                image: '',
                category: '',
                stock: ''
            });
            setPreviewImage('');
        } catch (error) {
            console.error('Error adding product:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add product';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
            <Navbar />
            <ToastContainer />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="space-y-8">
                    {/* Add Product Form */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mx-auto max-w-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                            Add New Product
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-purple-900 mb-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-purple-900 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={newProduct.description}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                    rows="3"
                                    placeholder="Enter product description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-purple-900 mb-1">
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newProduct.price}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500 "
                                        placeholder="Enter price"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-purple-900 mb-1">
                                        Original Price
                                    </label>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={newProduct.originalPrice}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                        placeholder="Enter original price"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-purple-900 mb-1">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={newProduct.stock}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                        placeholder="Enter stock quantity"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-purple-900 mb-1">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={newProduct.category}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                    >
                                        <option value="">Select category</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Books">Books</option>
                                        <option value="Home">Home & Living</option>
                                        <option value="Beauty">Beauty</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-purple-900 mb-1">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    name="image"
                                    value={newProduct.image}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                    placeholder="Enter image URL"
                                />
                            </div>

                            {previewImage && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-purple-900 mb-2">
                                        Image Preview
                                    </label>
                                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Adding Product...' : 'Add Product'}
                            </button>
                        </form>
                    </div>

                    {/* Products List */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mx-auto max-w-4xl">
                        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                            Your Products
                        </h2>
                        <div className="space-y-4">
                            {products.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No products added yet</p>
                            ) : (
                                products.map((product) => (
                                    <div
                                        key={product._id}
                                        className="flex items-start space-x-4 p-4 rounded-lg border border-purple-100 hover:border-purple-300 transition-all duration-200"
                                    >
                                        <div className="w-24 h-24 flex-shrink-0">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-purple-900">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {product.description}
                                            </p>
                                            <div className="mt-2 flex items-center space-x-4">
                                                <span className="text-purple-600 font-medium">
                                                    Tk {product.price}
                                                </span>
                                                <span className="text-gray-500">
                                                    Original: Tk {product.originalPrice}
                                                </span>
                                                <span className="text-gray-500">
                                                    Stock: {product.stock}
                                                </span>
                                                <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                                                    {product.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupplierDashboard;