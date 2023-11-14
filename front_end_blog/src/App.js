import { useState, useEffect, useRef } from 'react';
import Blog from './components/ViewBlog.js';
import blogService from './services/blogs.js';
import loginService from './services/login.js';
import BlogForm from './components/BlogForm.js';
import LoginForm from './components/LoginForm.js';
import Notification from './components/Notification.js';
import Togglable from './components/Togglable.js';
import './App.css';

function App() {
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

  const createBlog =  async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      const createdBlog = await blogService.create(blogObject);
      createdBlog.user = user;
      setBlogs(blogs.concat(createdBlog));
      setMessage({
        text: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        isError: false
      });
      setTimeout(() => {
        setMessage({
          text: '',
          isError: false
        });
      }, 5000);
    }
    catch(error) {
      setMessage({
        text: `${error.response.data.error}`,
        isError: true
      });
      setTimeout(() => {
        setMessage({
          text: '',
          isError: false
        });
      }, 4000);
    }
  };

  const deleteBlog = async (id, title) => {
    try{
      // console.log('blog to be deleted', id);
      if (window.confirm(`Please comfirm you want to delete ${title}`)) {
        blogService.blogDelete(id);
      }

      setBlogs(blogs.filter(blog => blog.id !== id));
      setMessage({
        text: 'blog deleted',
        isError: false
      });
      setTimeout(() => {
        setMessage({
          text: '',
          isError: false
        });
      }, 5000);
    } catch(error) {
      console.log('error',error);
    }
  };

  const loginForm = () =>  {
    return (
      <div >
        <Togglable buttonLabel='login'>
          <LoginForm
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    );
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <div id='header'>
        <div className='titleWrapper'>
          <h2 className="test">DevBlogs</h2>
        </div>
        <input id='searchBox' placeholder='search'/>
      </div>
      { message.text ? <Notification message={message.text} isError={message.isError} />
        : undefined }
      {user === null ?
        loginForm() :
        <div>
          <div>
            <p>{user.name} logged in</p>
            <button onClick={handleLogout}>logout</button>
          </div>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm
              createBlog={createBlog}
            />
          </Togglable>
          <div>
            <h2>Blogs</h2>
            {sortedBlogs.map((blog) => (
              <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} currentUser={user}/>
            ))}
          </div>
        </div>
      }
    </div>
  );
}

export default App;
