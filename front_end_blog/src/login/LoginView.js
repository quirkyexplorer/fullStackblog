import Togglable from '../components/Togglable.js';
import LoginForm from '../components/LoginForm.js';
import styled from 'styled-components'

export default function LoginView({ handleLogin, handleLogout, user }) {

  const loginForm = () =>  {
    return (
     
          
            <LoginForm
              handleSubmit={handleLogin}
            />
          
        
    );   
  };

  return (
      <div >
        {user === null ?
          loginForm() :
          <div>
            <div>
              <p>{user.name} logged in</p>
              <button onClick={handleLogout}>logout</button>
            </div>
          </div>
        }
      </div>  
  );
}
