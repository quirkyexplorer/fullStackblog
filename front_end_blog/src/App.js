import { useState, useEffect} from 'react';
import Blog from './components/Blog.js';
import blogService from './services/blogs.js';
import loginService from './services/login.js'
import login from './services/login.js';

function App() {
    const [blogs, setBlogs] = useState([]);
    const [newBlog, setNewBlog] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null)

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

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                username
                <input
                type='text'
                value={username}
                name='username'
                onChange={({ target }) => { setUsername(target.value)}}
                />
            </div>

            <div>
                password
                <input
                type='password'
                value={password}
                name='password'
                onChange={({ target }) => { setPassword(target.value)}}
                />
            </div>

            <button type='submit'>login</button>

        </form>
    );

    const blogForm = () => (
        //FIX ME  - add a way to add blogs and handle the change
        <form onSubmit={'addBlog'}>
            <input
                value={'newBlog'}
                onChange={'handleBlogChange'}
            />
            <button type='submit'>save</button>
        </form>
    );

  return (
   <div>
        <h2>Blogs</h2>

        {user === null ? 
        <div>
          <h2>User Login</h2>
          {loginForm()} 
        </div>  
          :
          <div>
            <p>{user.name} logged in</p> <button onClick={handleLogout}>logout</button>

            {blogForm()}



            {blogs.map( blog => <Blog key={blog.id} blog ={blog}/>)}

          </div>
          }
        
        
        
   </div>
  );
}

export default App;