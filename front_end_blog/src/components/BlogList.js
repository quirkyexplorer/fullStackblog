import BlogView from "./BlogView.js";
import styled from "styled-components";
export default function BlogList({ sortedBlogs, deleteBlog, currentUser, handleLogout }) {
  return (
    <MainContainer>
      <div>
        <div>
          <p>{currentUser.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
        </div>
      </div>
      <BlogGrid>
        {sortedBlogs.map((blog) => (
          <BlogView
            key={blog.id}
            blog={blog}
            deleteBlog={deleteBlog}
            currentUser={currentUser}
          />
        ))}
      </BlogGrid>
      
    </MainContainer>
  );
}

const BlogContainer = styled.div`
  /* Styles for individual blog items (optional) */
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

const MainContainer = styled.div`
  color: white;
`;