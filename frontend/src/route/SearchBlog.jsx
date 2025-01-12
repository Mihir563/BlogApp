import React, { useState } from 'react';
import axios from 'axios';

const SearchBlog = () => {
    const [query, setQuery] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:5000/api/blogs/search?query=${query}`);
            setBlogs(response.data);
        } catch (err) {
            setError('Failed to fetch blogs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
            <h4 className="text-3xl font-bold text-gray-800 mb-6 text-center">Search Blogs</h4>

            {/* Search Input */}
            <div className="w-full max-w-2xl flex items-center mb-8">
                <input
                    type="text"
                    placeholder="Search by title or content"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    onClick={handleSearch}
                    className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none"
                >
                    Search
                </button>
            </div>

            {/* Loading Spinner */}
            {loading && <p>Loading...</p>}

            {/* Error Message */}
            {error && <p className="text-red-600">{error}</p>}

            {/* Search Results */}
            <div className="w-full max-w-4xl">
                {blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <div key={blog._id} className="bg-white shadow-md rounded-lg p-6 mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{blog.title}</h3>
                            <p className="text-gray-600 mb-4">{blog.blog.substring(0, 200)}...</p>
                            <p className="text-sm text-gray-500">
                                Posted by <strong>{blog.username}</strong> on{' '}
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                ) : (
                    !loading && <p className="text-gray-500">No blogs found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchBlog;
