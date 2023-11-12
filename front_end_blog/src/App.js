import { useState, useEffect, useRef} from 'react';
import Blog from './components/ViewBlog.js';
import blogService from './services/blogs.js';
import loginService from './services/login.js'
import BlogForm from './components/BlogForm.js';
import LoginForm from './components/LoginForm.js';
import Notification from './components/Notification.js';
import Togglable from './components/Togglable.js';
import updateLikes from "./services/likes.js" ;
import './App.css';

function App() {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState({
      text: "",
      isError: false
    });
    const [likes, setLikes]= useState(0);
    const blogFormRef = useRef();
    
    useEffect(() => {
        blogService.getAll().then(blogs =>
        setBlogs( blogs )
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

    const handleLikes = async() => {
      updateLikes();
    }

    const handleLogin = async (userObject) => {
        const { username, password } = userObject;
        try {
            const user = await loginService.login({
                username, password,
            })
            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            blogService.setToken(user.token);
            setUser(user);
        } catch (exception) {
          // exception.response.data.error
          console.log(exception)
          setErrorMessage({
            text: `${exception.response.data.error}`,
            isError: true    
          });
            setTimeout(() => {
              setErrorMessage({
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

    const createBlog = async (blogObject) => {
        blogFormRef.current.toggleVisibility();
        try {
            const createdBlog = await blogService.create(blogObject);
            setBlogs(blogs.concat(createdBlog));
        }
        catch(error) {
            setErrorMessage({
                text: `${error.response.data.error}`,
                isError: true    
            });
            setTimeout(() => {
              setErrorMessage({
                  text: "",
                  isError: false
              });
              }, 4000);
        }
    }

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
    }

  return (
   <div>
        <div id='header'>
            <div className='titleWrapper'>
                <h2 className="test">DevBlogs</h2>
            </div>
            <input id='searchBox' placeholder='search'/>
        </div>
        { errorMessage.text ? <Notification message={errorMessage.text} isError={errorMessage.isError} /> 
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
                      {blogs.map( blog => <Blog key={blog.id} blog ={blog} handleLikes={handleLikes}/>)}
                    </div> 
                  </div> 
          }
   </div>
  );
}

export default App;
