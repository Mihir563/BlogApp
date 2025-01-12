import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'material-icons/iconfont/material-icons.css';
import Header from "./Header";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBlogs(response.data.map((blog) => ({ ...blog, likes: 0 })));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`http://localhost:5000/api/blog/${id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === id ? { ...blog, likes: response.data.likes } : blog
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to like the blog");
    }
  };

  const handleComment = (id) => {
    navigate(`/blog/${id}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 mt-10">
        <div className="w-full max-w-4xl mt-6 space-y-6">
          {blogs.length === 0 ? (
            <div className="flex justify-center items-center h-20">
              <p className="text-lg text-gray-600">No blogs found.</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {blogs.map((blog) => (
                <li
                  key={blog._id}
                  className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-50 transition duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm text-gray-500">@{blog.username || "anonymous"}</p>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {blog.title}
                      </h2>
                    </div>
                  </div>

                  {/* Render Blog Content as HTML */}
                  <div
                    className="text-gray-600 mt-4"
                    dangerouslySetInnerHTML={{ __html: blog.blog }}
                  />

                  <p className="text-gray-600 mt-4">
                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : " "}
                  </p>

                  <div className="flex space-x-6 mt-6 text-sm">
                    <button
                      className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                      onClick={() => handleLike(blog._id)}
                    >
                      <span className="material-icons">thumb_up</span>
                      <span>{blog.likes} Likes</span>
                    </button>
                    <button
                      className="flex items-center space-x-1 text-gray-500 hover:text-gray-600"
                      onClick={() => handleComment(blog._id)}
                    >
                      <span className="material-icons">comment</span>
                      <span>Comment</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
