import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import blogService from './services/blogs.js';
import loginService from './services/login.js';
import Home from './pages/Home.js';
import LoginView from './login/LoginView.js';

export default function AppRouting() {

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({
    text: '',
    isError: false
  });
  const blogFormRef = useRef();

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs( initialBlogs );
      }
      );
  }, []);
  const padding = {
    padding: 5
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (userObject) => {
    const { username, password } = userObject;
    try {
      const user = await loginService.login({
        username, password,
      });
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      // exception.response.data.error
      console.log(exception);
      setMessage({
        text: `${exception.response.data.error}`,
        isError: true
      });
      setTimeout(() => {
        setMessage({
          text: '',
          isError: false
        });
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    window.localStorage.clear();
    window.location.reload();
  };

  return (
    <div>
      <Router>
        <div>
          <Link style={padding} to={'/'}>Home</Link>
          <Link style={padding} to={'/blogs'}>Blogs</Link>
          <Link style={padding} to={'/users'}>Users</Link>
        </div>
        <Routes>
          {/* <Route path='/blog/:id' element={<viewBlog />} />
          <Route path='/users' element={<Users />} /> */}
          {/* <Route path='/home' element={<Blogs />} /> */}
          <Route path='/' element={<LoginView
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            user={user}
          />} />
        </Routes>

        <div>
          <i>Blog app, blogs about Software Engineering, created by Daniel Segura 2023</i>
        </div>

      </Router>
    </div>
  );
}
