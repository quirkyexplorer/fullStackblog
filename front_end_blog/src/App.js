import { useState, useEffect, useRef } from "react";
import Blog from "./components/BlogView.js";
import blogService from "./services/blogs.js";
import loginService from "./services/login.js";
import BlogForm from "./components/BlogForm.js";
import LoginForm from "./components/LoginForm.js";
import Notification from "./components/Notification.js";
import Togglable from "./components/Togglable.js";
import "./App.css";
import Navigation from "./pages/Navigation.js";
import LoginView from "./login/LoginView.js";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import BlogList from "./components/BlogList.js";
import styled from 'styled-components';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState({
    text: "",
    isError: false,
  });
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => {
      setBlogs(initialBlogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (userObject) => {
    const { username, password } = userObject;
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      navigate("/");
    } catch (exception) {
      // exception.response.data.error
      console.log(exception);
      setMessage({
        text: `${exception.response.data.error}`,
        isError: true,
      });
      setTimeout(() => {
        setMessage({
          text: "",
          isError: false,
        });
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    window.localStorage.clear();
    window.location.reload();
    navigate("/login");
  };

  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      const createdBlog = await blogService.create(blogObject);
      createdBlog.user = user;
      setBlogs(blogs.concat(createdBlog));
      setMessage({
        text: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        isError: false,
      });
      setTimeout(() => {
        setMessage({
          text: "",
          isError: false,
        });
      }, 5000);
    } catch (error) {
      setMessage({
        text: `${error.response.data.error}`,
        isError: true,
      });
      setTimeout(() => {
        setMessage({
          text: "",
          isError: false,
        });
      }, 4000);
    }
  };

  const deleteBlog = async (id, title) => {
    try {
      // console.log('blog to be deleted', id);
      if (window.confirm(`Please comfirm you want to delete ${title}`)) {
        blogService.blogDelete(id);
        setBlogs(blogs.filter((blog) => blog.id !== id));
        setMessage({
          text: "blog deleted",
          isError: false,
        });
        setTimeout(() => {
          setMessage({
            text: "",
            isError: false,
          });
        }, 5000);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <Navigation ></Navigation>
      <MainContainer id="MainContainer">
        <div className="titleWrapper">
          <Title className="test">DevBlogs</Title>
        </div>
        <Routes>
          <Route 
            path="/"
            element={ user ? 
              <BlogList // if user is logged in navigate home
                sortedBlogs={sortedBlogs}
                deleteBlog={deleteBlog}
                currentUser={user}
                handleLogout={handleLogout}
              />           :
              <Navigate replace to="/login" />
          } />

          <Route
            path="/login"
            element={
              <LoginView
                id='loginform'
                handleLogin={handleLogin}
                handleLogout={handleLogout}
                user={user}
              />}
          
          />

          {/* if user is not logged in, navigate to the login component */}
          {/* {user ? (
                <Route
                path="/"
                element={
                  <BlogList // if user is logged in navigate home
                    sortedBlogs={sortedBlogs}
                    deleteBlog={deleteBlog}
                    currentUser={user}
                    handleLogout={handleLogout}
                  />
                }
                />
          ) : (
            <Route
              path="/login"
              element={
                <LoginView
                  handleLogin={handleLogin}
                  handleLogout={handleLogout}
                  user={user}
                />}
            />
          )} */}
        </Routes>
      </MainContainer>
      
      {/* <input id="searchBox" placeholder="search" /> */}
      {/* {message.text ? (
        <Notification message={message.text} isError={message.isError} />
      ) : undefined}
      {user === null ? (
        <LoginView
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          user={user}
        ></LoginView>
      ) : (
        <div>
          <div>
            <p>{user.name} logged in</p>
            <button onClick={handleLogout}>logout</button>
          </div>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
          <div>
            <h2>Blogs</h2>
            <BlogList
              sortedBlogs={sortedBlogs}
              deleteBlog={deleteBlog}
              currentUser={user}
            />
          </div>
        </div>
      )} */}
    </div>
  );
}

const Title = styled.h1`
  color: black;
  text-shadow:
    /* White glow */
    0 0 7px  hsl(0, 0%, 100%),
    0 0 10px hsl(0, 0%, 100%),
    0 0 21px hsl(0, 0%, 100%);
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default App;
