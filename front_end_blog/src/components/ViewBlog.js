import { useState, useEffect } from 'react';
import likeService from '../services/likes.js' ;

export default function Blog({ blog, deleteBlog, currentUser }) {
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
    const user = currentUser;

    const handleClick = () => {
      deleteBlog(blog.id, blog.title);
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
    <div className='blog'>
      <p className='blogTitle'>
        {blog.title} {blog.author}
        <button className='viewHidden' onClick={toggleVisibility} style={hideWhenVisible}>view</button>
        <button className='hide' onClick={toggleVisibility} style={showWhenVisible}>hide</button>
      </p>
      <div className='info' style={showWhenVisible}>
        <p className='url'>
          {blog.url}
        </p>
        <p className='likes'>
          {likes}
          <button onClick={handleLikes}>Like</button>
        </p>
        <p className='username'>
          {/* fix me, call the latest user */}
          {blog.user.username}
        </p>
        {removeButton()}
      </div>
    </div>
  );
}

