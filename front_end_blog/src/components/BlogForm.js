export default function BlogForm({
  createBlog,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url
  }) {

    return (
        <div>
            <h3>New Blog</h3>
            <form onSubmit={createBlog}>
                <div>
                    title: <input placeholder="title" value={title} onChange={handleTitleChange}/>
                </div>
                <br></br>
                <div>
                    author: <input placeholder="author" value={author} onChange={handleAuthorChange}/>
                </div>
                <br></br>
                <div>
                    Url: <input placeholder="url" value={url} onChange={handleUrlChange}/>
                </div>
                <div>
                    <button type="submit">save</button>
                </div>
            </form>
        </div>
    );
};