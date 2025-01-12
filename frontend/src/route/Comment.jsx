import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from './Header';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

const Comment = () => {
    const { blogId } = useParams(); // Get the blogId from the URL parameters
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
        ],
    };

    useEffect(() => {
        const fetchBlogAndComments = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('User not authenticated');

                // Fetch the blog by blogId
                const blogResponse = await axios.get(`https://blogapp-api-yzwv.onrender.com/api/blog/${blogId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Fetch the comments for the blog
                const commentsResponse = await axios.get(`https://blogapp-api-yzwv.onrender.com/api/comments/${blogId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setBlog(blogResponse.data);
                setComments(commentsResponse.data.comments); // Access 'comments' correctly
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogAndComments();
    }, [blogId]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);

        if (isToday(date)) {
            return format(date, "'Today at' h:mm a");
        } else if (isYesterday(date)) {
            return format(date, "'Yesterday at' h:mm a");
        } else {
            return format(date, "MMMM d 'at' h:mm a");
        }
    };

    const handleAddComment = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('User not authenticated');

            // Add a new comment
            await axios.post(
                `https://blogapp-api-yzwv.onrender.com/api/comments/${blogId}`,
                { comment: newComment, blogId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNewComment(''); // Clear the input field

            // Re-fetch comments
            const updatedComments = await axios.get(`https://blogapp-api-yzwv.onrender.com/api/comments/${blogId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setComments(updatedComments.data.comments); // Update comments state
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add comment');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100 py-10 px-4 mt-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Back to Dashboard
                </button>

                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
                    {blog && (
                        <>
                            <h4 className="text-2xl font-thin mb-4">@{blog.username}</h4>
                            <h2 className="text-2xl font-bold mb-4">{blog.title}</h2>
                            <div
                                className="text-gray-700 mb-6"
                                dangerouslySetInnerHTML={{ __html: blog.blog }} // Render blog content as HTML
                            ></div>
                        </>
                    )}

                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-2">Comments</h3>
                        {comments.length === 0 ? (
                            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                        ) : (
                            <ul className="space-y-6">
                                {comments.map((comment) => (
                                    <li key={comment._id} className="flex space-x-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                src="https://via.placeholder.com/40"
                                                alt="User Avatar"
                                                className="w-10 h-10 rounded-full"
                                            />
                                        </div>
                                        <div className="flex-1 bg-gray-100 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div
                                                    className="font-semibold text-blue-600"
                                                    dangerouslySetInnerHTML={{ __html: comment.username }}
                                                />
                                                <span className="text-sm text-gray-500">
                                                    {formatTimestamp(comment.createdAt)}
                                                </span>
                                            </div>
                                            <div
                                                className="text-gray-800"
                                                dangerouslySetInnerHTML={{ __html: comment.comment }}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-6">
                            <ReactQuill
                                value={newComment}
                                onChange={setNewComment}
                                modules={quillModules}
                                placeholder="Write your comment..."
                                className="bg-white rounded-lg"
                            />
                            <button
                                onClick={handleAddComment}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                Add Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Comment;
