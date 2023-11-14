import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './ViewBlog';

test('renders content', () => {

  const blog = {
    title: 'hello world',
    author: 'daniel',
    url: 'daniel.com',
    likes: 1001,
    user : {
      username:'Daniel'
    }
  };

  //person logged in
  const user= {
    username: 'Andres'
  };

  const { container } = render(<Blog blog={blog} currentUser={user}/>);

  // screen.debug();

  const div = container.querySelector('.blog');

  // screen.debug(container);


  expect(div).toHaveTextContent(
    'hello world'
  );

});

// FIX ME UNIT TEST FOR A BLOG COMPONENT
// test('clicking the button calls the even handler once', async () => {
//   const blog = {
//     title: 'hello world',
//     author: 'daniel',
//     url: 'daniel.com',
//     likes: 1001,
//     user : {
//       username:'Daniel'
//     }
//   };

//   const mockHandler = jest.fn();

//   const user= {
//     username: 'Daniel'
//   };

//   render(<Blog key={blog.id} blog={blog} currentUser={user} deleteBlog={mockHandler}/>);

//   const event = userEvent.setup();
//   const button = screen.getByText('remove');
//   await event.click(button);

//   expect(mockHandler.mock.calls).toHaveLength(1);
// });



