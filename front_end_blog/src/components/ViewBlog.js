import { useState } from 'react';


export default function Blog({ blog, handleLikes }) {
  const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }
  return (
    <div className="blogStyle"> 
          <p>
            {blog.title} {blog.author}
            <button onClick={toggleVisibility} style={hideWhenVisible}>view</button>
            <button onClick={toggleVisibility} style={showWhenVisible}>hide</button>
          </p>
          <div style={showWhenVisible}>
            <p>
              {blog.url}
            </p>
            <p>
              {blog.likes}
              <button onClick={handleLikes}>Like</button>
            </p>
            <p>
              {blog.user.username}
            </p>      
          </div>
        </div>  
  )
    
}

  