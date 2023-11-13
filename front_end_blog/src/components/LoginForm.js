import { useState } from 'react';

export default function LoginForm({
  handleSubmit,
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const addUser = (event) => {
    event.preventDefault();
    handleSubmit({
      username,
      password
    });
    setUsername('');
    setPassword('');
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={addUser}>
        <div>
                username
          <input
            type='text'
            value={username}
            name='username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
                password
          <input
            type='password'
            value={password}
            name='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <button type='submit'>login</button>

      </form>
    </div>
  );
}
