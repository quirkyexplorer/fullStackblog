import React from 'react'

export default function LoginForm({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange, 
    password, 
    username,}) {
  return (
    <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div>
                username
                <input
                type='text'
                value={username}
                name='username'
                onChange={handleUsernameChange}
                />
            </div>

            <div>
                password
                <input
                type='password'
                value={password}
                name='password'
                onChange={handlePasswordChange}
                />
            </div>

            <button type='submit'>login</button>

        </form>
    </div>
  )
}
