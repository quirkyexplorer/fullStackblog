import { useState, useRef } from 'react';
import styled from 'styled-components';

export default function LoginForm({ handleSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const addUser = (event) => {
    event.preventDefault();
    handleSubmit({
      username,
      password,
    });
    setUsername('');
    setPassword('');
  };
  return (
    <LoginFormContainer>
      <LoginFormWrapper>
        <Box>
            <TitleWrapper>
              <LoginTitle>Login</LoginTitle>
            </TitleWrapper>           
            <Form onSubmit={addUser}>
              <div>
                username
                <input
                  className='username'
                  type="text"
                  value={username}
                  name="username"
                  onChange={({ target }) => setUsername(target.value)}
                />
              </div>

              <div>
                password
                <input
                  className='password'
                  type="password"
                  value={password}
                  name="password"
                  onChange={({ target }) => setPassword(target.value)}
                />
              </div>

              <button type="submit">login</button>
            </Form>
        </Box>
        
      </LoginFormWrapper>      
    </LoginFormContainer>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: white;
`;

const LoginTitle = styled.div`
font-size: 1.5em;
  color:  hsl(0, 0%, 100%);
  text-shadow:
    /* White glow */
    0 0 10px  hsl(0, 0%, 100%),
    0 0 15px hsl(0, 0%, 100%),
    0 0 30px hsl(0, 0%, 100%);
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Box = styled.div`
  display:flex;
  flex-direction: column;
`;

const LoginFormWrapper = styled.div`
  display:flex;
  justify-content: center;
`;


const LoginFormContainer = styled.div`
  position: absolute;
  top: 35%;
  width: 100%;
`;