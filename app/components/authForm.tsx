// components/AuthForm.tsx

import React from 'react';

interface AuthFormProps {
  form: { email: string; password: string };
  isLogin: boolean;
  message: string;
  loading: boolean;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  toggleIsLogin: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  form,
  isLogin,
  message,
  loading,
  handleFormChange,
  handleFormSubmit,
  toggleIsLogin,
}) => {
  return (
    <div>
      <h1>{isLogin ? 'Log in' : 'Sign up'}</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleFormChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleFormChange}
        />
        <button type="submit" disabled={loading}>
          {isLogin ? 'Log in' : 'Sign up'}
        </button>
        <button type="button" onClick={toggleIsLogin}>
          Switch to {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AuthForm;
