import { useState, useEffect} from 'react';
import Blog from './components/Blog.js';
import blogService from './services/blogs.js';

function App() {
    const [blogs, setBlogs] = useState([])

    useEffect(() => {
        blogService.getAll().then(blogs =>
        setBlogs( blogs )
        );  
    }, []);


  return (
   <div>
        <h2>blogs</h2>
        {blogs.map( blog => <Blog key={blog.id} blog ={blog}/>)}
   </div>
  );
}

export default App;
