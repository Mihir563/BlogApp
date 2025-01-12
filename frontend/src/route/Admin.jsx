import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const [blogs, setBlogs] = useState([]); // Array to store the blogs
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState({});
    const [editData, setEditData] = useState({ id: '', title: '', blog: '' }); // State for editing data
    const navigate = useNavigate();


    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    // Fetch user blogs
    const fetchUserBlogs = async () => {
        try {
            if (!token) throw new Error("User not authenticated");

            const response = await axios.get(`http://localhost:5000/api/admin/${username}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setBlogs(response.data.blogs || []);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch user blogs');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user profile details
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/${username}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProfile(response.data.Username || response.data.username);
            console.log(profile);
            
            
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch user profile');
        }
    };

    useEffect(() => {
        fetchUserBlogs();
        fetchUserProfile();
    }, [username]);

    const handleLogout = () => {
        window.location.href = '/login';
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    };

    // Delete a blog
    const deleteBlog = async (blogId) => {
        const confirmation = confirm("Are you sure you want to delete this blog?");
        if (confirmation) {
            try {
                await axios.delete(`http://localhost:5000/api/blog/${blogId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
                alert("Blog deleted successfully.");
            } catch (error) {
                setError(error.response?.data?.message || "Failed to delete the blog. Please try again.");
            }
        } else {
            alert("Blog deletion canceled.");
        }
    };

    // Open edit modal and populate data
    const openEditModal = (blog) => {
        setEditData({ id: blog._id, title: blog.title, blog: blog.blog });
        setEditing(true);
    };

    // Handle input changes in the edit modal
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Submit edited blog
    const submitEdit = async () => {
        try {
            await axios.put(
                `http://localhost:5000/api/blog/${editData.id}`,
                { title: editData.title, blog: editData.blog },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) =>
                    blog._id === editData.id ? { ...blog, title: editData.title, blog: editData.blog } : blog
                )
            );

            alert("Blog updated successfully.");
            setEditing(false);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to update the blog. Please try again.");
        }
    };

    const handleComment = (id) => {
        navigate(`/blog/${id}`);
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100 py-10 px-4 mt-10">
                {/* Profile Section */}
                <div className="bg-white shadow-md rounded-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
                    <p><strong>Username:</strong> {profile.username }</p>
                    <p><strong>Email:</strong> {profile.email || 'Not available'}</p>
                    <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString() || 'N/A'}</p>
                    <button
                        className="material-icons pr-6"
                        onClick={() => alert('Profile editing feature coming soon!')}
                    >
                        edit
                    </button>
                    <button
                        className="material-icons"
                        onClick={handleLogout}
                    >
                        logout
                    </button>
                </div>

                {/* Blogs Section */}
                <h1 className="text-2xl font-bold mb-6">Blogs by @{username}</h1>
                {blogs.length === 0 ? (
                    <p>No blogs found for this user.</p>
                ) : (
                    <ul className="space-y-4">
                        {blogs.map((blog) => (
                            <li key={blog._id} className="bg-white shadow-md rounded-md p-4">
                                <h2 className="text-xl font-semibold">{blog.title}</h2>
                                <p className="text-gray-700 mt-2" dangerouslySetInnerHTML={{__html: blog.blog }}></p>
                                <p className="text-gray-500 text-sm mt-1">Author: {blog.username}</p>

                                {/* Action Buttons */}
                                <div className="mt-4 flex space-x-4">
                                    <button
                                        className="material-icons"
                                        onClick={() => openEditModal(blog)}
                                    >
                                        edit
                                    </button>
                                    <button
                                        className="material-icons"
                                        onClick={() => deleteBlog(blog._id)}
                                    >
                                        delete
                                    </button>
                                    <button
                                        className="material-icons"
                                        onClick={() => handleComment(blog._id)}
                                    >
                                        comments
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Edit Modal */}
                {editing && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white rounded-md shadow-md p-6 w-96">
                            <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
                            <p className="text-sm font-bold mb-4">Please Edit between the tags</p>
                            <label className="block mb-2 font-semibold">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={editData.title}
                                onChange={handleEditChange}
                                className="w-full mb-4 p-2 border rounded"
                            />
                            <label className="block mb-2 font-semibold">Content</label>
                            <textarea
                                name="blog"
                                value={editData.blog}
                                onChange={handleEditChange}
                                className="w-full p-2 border rounded"
                                rows="5"
                            />
                            <div className="mt-4 flex justify-end space-x-4">
                                <button
                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                    onClick={() => setEditing(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={submitEdit}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default Admin;
