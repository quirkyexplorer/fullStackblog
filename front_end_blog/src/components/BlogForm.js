import { useState } from 'react';

export default function BlogForm({
  createBlog
}) {
  const [title, setTitle]= useState('');
  const [author, setAuthor]= useState('');
  const [url, setUrl]= useState('');

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h3>New Blog</h3>
      <form className='createForm' onSubmit={addBlog}>
        <div>
                    title: <input placeholder="title" value={title} onChange={({ target }) => { setTitle(target.value);}}/>
        </div>
        <br></br>
        <div>
                    author: <input placeholder="author" value={author} onChange={({ target }) => { setAuthor(target.value);}}/>
        </div>
        <br></br>
        <div>
                    Url: <input placeholder="url" value={url} onChange={({ target }) => { setUrl(target.value);}}/>
        </div>
        <div>
          <button type="submit">save</button>
        </div>
      </form>
    </div>
  );
}