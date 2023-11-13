import { useState, useEffect } from 'react';
import likeService from '../services/likes.js' ;

export default function Blog({ blog, deleteBlog }) {
  const [visible, setVisible] = useState(false);
  const [likes, setLikes]= useState(blog.likes);
  const [user, setUser] = useState('hellow');
  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    // This effect will run whenever the 'likes' state changes
    likeService.getById(blog.id).then( (temp) => {
      setLikes(temp.likes);}
    );
    // You can perform any additional actions here if needed
  }, [likes]);

  const handleLikes = async () => {
    let newLikes = 1;
    await likeService.updateLikes( blog.id ,{ likes: newLikes });
    setLikes((prevLikes) => prevLikes + newLikes);
  };

  //  conditionally renders the remove button
  const removeButton = () => {
    const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'));

    const handleClick = () => {
      if (window.confirm(` Please comfirm you want to delete ${blog.title}`)) {
        deleteBlog(blog.id);
      }

    };

    return (
      <div>
        {/* {console.log('user username',user.username, 'blog username', blog.user.username)} */}
        { user.username === blog.user.username?
          <button onClick={handleClick}>remove</button> : null}
      </div>
    );
  };

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
          {likes}
          <button onClick={handleLikes}>Like</button>
        </p>
        <p>
          {/* fix me, call the latest user */}
          {blog.user.username}
        </p>
        {removeButton()}
      </div>
    </div>
  );
}

