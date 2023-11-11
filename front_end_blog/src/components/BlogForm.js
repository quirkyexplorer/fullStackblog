export default function BlogForm(props) {

    return (
        <div>
            <h3>New Blog</h3>
            <form onSubmit={props.createBlog}>
                <div>
                    title: <input placeholder="title" value={props.title} onChange={props.handleTitleChange}/>
                </div>
                <br></br>
                <div>
                    author: <input placeholder="author" value={props.author} onChange={props.handleAuthorChange}/>
                </div>
                <br></br>
                <div>
                    Url: <input placeholder="url" value={props.url} onChange={props.handleUrlChange}/>
                </div>
                <div>
                    <button type="submit">save</button>
                </div>
            </form>
        </div>
    );
};