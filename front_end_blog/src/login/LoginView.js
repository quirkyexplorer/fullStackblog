import Togglable from '../components/Togglable.js';
import LoginForm from '../components/LoginForm.js';


export default function LoginView({ handleLogin, handleLogout, user }) {

  const loginForm = () =>  {
    return (
      <div >
        <Togglable buttonLabel='login'>
          <LoginForm
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    );
  };

  return (
    <div className='loginContainer'>
      <div className='loginBox'>
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
    </div>
  );
}
