export default function Blogs() {
  
  return (
    <div>
      <h2>Blogs</h2>
      {sortedBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} currentUser={user}/>
      ))}
    </div>
  );
}
