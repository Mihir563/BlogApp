import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from './Header';

const SendBlog = () => {
  const [title, setTitle] = useState('');
  const [blog, setBlog] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  // Ref for the ReactQuill editor
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  async function shareBlog() {
    const url = 'https://blogapp-api-yzwv.onrender.com/api/sblog';
    const token = localStorage.getItem('token');

    if (!token) {
      setIsLogin(false);
      alert('Please Login First');
      return;
    }

    const userData = {
      title,
      blog,
    };

    try {
      const response = await axios.post(url, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Blog submitted successfully!');
      setTitle('');
      setBlog('');
    } catch (error) {
      alert('Failed to submit blog');
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-10 px-4 mt-12">
        <h4 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          What's in your mind?
        </h4>

        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="blog"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Blog
            </label>
            <ReactQuill
              ref={quillRef}
              value={blog}
              onChange={setBlog}
              modules={modules}
              theme="snow"
              placeholder="Write Everything You've got in Your Crazy Mind"
              className="bg-white rounded-lg"
            />
          </div>

          <button
            type="submit"
            onClick={shareBlog}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default SendBlog;
