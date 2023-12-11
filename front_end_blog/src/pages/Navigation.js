import styled from 'styled-components';
import { Link } from "react-router-dom";
import LoginView from '../login/LoginView.js';

export default function Navigation({user})  {
  const padding = {
    paddingRight: 5,
  };
  return (
    <>
      {user   // checking if user is not null in which case is logged in -> shows navigation links
        ?   <div>
              <Link style={padding} to="/">Home</Link>
              <Link style={padding} to="/createNew">Create New</Link>
              <Link style={padding} to="/about">About</Link>
            </div> 
        :  null // otherwise show the button and handle login
      }
    </>
  );
};

const HomeWrapper = styled.div`
  height: 100vh;
  width: 100vh;
  `
