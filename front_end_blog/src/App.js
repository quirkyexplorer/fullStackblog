import { useState, useEffect} from 'react';
import Blog from './components/ViewBlog.js';
import blogService from './services/blogs.js';
import loginService from './services/login.js'
import BlogForm from './components/BlogForm.js';
import LoginForm from './components/LoginForm.js';
import Notification from './components/Notification.js';
import login from './services/login.js';
import './App.css';

function App() {
    const [blogs, setBlogs] = useState([]);
    const [newBlog, setNewBlog] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState({
      text: "",
      isError: false
    });
    const [loginVisible, setLoginVisible] = useState(false);
    const [title, setTitle]= useState('');
    const [author, setAuthor]= useState('');
    const [url, setUrl]= useState('');
    const [likes, setLikes]= useState(0);
    
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

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )

            blogService.setToken(user.token);
            setUser(user);
            setUsername('');
            setPassword('');
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

    const createBlog = async (event) => {
        event.preventDefault();
        const newBlogObject = {
            title,
            author,
            url,
            likes,
        }
        try {
            const createdBlog = await blogService.create(newBlogObject);
            setBlogs(blogs.concat(createdBlog));
            setTitle('');
            setAuthor('');
            setUrl('');
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
        const hideWhenVisible = {display: loginVisible ? 'none' : ''}
        const showWhenVisible = {display: loginVisible ? '' : 'none'}

        return (
            <div >
                <div style={hideWhenVisible}>
                <button onClick={() => setLoginVisible(true)}>log in</button>
                </div>

                <div style={showWhenVisible}>
                <LoginForm
                    username={username}
                    password={password}
                    handleUsernameChange={({ target }) => setUsername(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}
                    handleSubmit={handleLogin}
                />
                <button onClick={() => setLoginVisible(false)}>cancel</button>
                </div>
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
                    <BlogForm
                      title={title}
                      handleTitleChange={({target})=> { setTitle(target.value)}}
                      author={author}
                      handleAuthorChange={({target})=> { setAuthor(target.value)}}
                      url={url}
                      handleUrlChange={({target})=> { setUrl(target.value)}}
                      createBlog={createBlog}
                    />
                    <div>         
                      <h2>Blogs</h2>         
                      {blogs.map( blog => <Blog key={blog.id} blog ={blog}/>)}
                    </div> 
                  </div> 
          }
   </div>
  );
}

export default App;
