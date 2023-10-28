import { useState, useEffect} from 'react';
import Blog from './components/ViewBlog.js';
import blogService from './services/blogs.js';
import loginService from './services/login.js'
import BlogForm from './components/BlogForm.js';
import LoginForm from './components/LoginForm.js';
import login from './services/login.js';
import './App.css';

function App() {
    const [blogs, setBlogs] = useState([]);
    const [newBlog, setNewBlog] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null)
    const [loginVisible, setLoginVisible] = useState(false);

    const [title, setTitle]= useState('');
    const [author, setAuthor]= useState('');
    const [url, setUrl]= useState('');
    const [likes, setLikes]= useState(0);
    
    const handleTitleChange = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        setTitle(event.target.value);
    }

    const handleAuthorChange = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        setAuthor(event.target.value);
    }

    const handleUrlChange =(event) => {
        event.preventDefault();
        console.log(event.target.value);
        setUrl(event.target.value);
    }


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
            setErrorMessage('Wrong credentials');
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    };

    const handleLogout = async (event) => {
        window.localStorage.clear(); 
        window.location.reload();
    };

    const addBlog = async (event) => {
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
            
            console.log('made it work?')
        }

        catch(error) {
            console.log('error', error);
            setErrorMessage(error);
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

        {user === null ? 
        <div>
          <h2>User Login</h2>
          {loginForm()} 
        </div>  
          :
          <div>
            <p>{user.name} logged in</p> <button onClick={handleLogout}>logout</button>
            
            <BlogForm
              title={title}
              handleTitleChange={handleTitleChange}
              author={author}
              handleAuthorChange={handleAuthorChange}
              url={url}
              handleUrlChange={handleUrlChange}
              addBlog={addBlog}
            />
            {blogs.map( blog => <Blog key={blog.id} blog ={blog}/>)}

          </div>
          }
        
        
        
   </div>
  );
}

export default App;
