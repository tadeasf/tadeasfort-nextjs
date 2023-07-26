"use client"
import React, { useState } from 'react';
import { supabase } from '../../util/supabaseClient';
import AuthForm from 'app/components/authForm';
import { Navigation } from 'app/components/nav';
import ProjectsLayout from 'app/projects/layout';
import useAuth from 'hooks/useAuth'

export default function Auth() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useAuth(); // Use the useAuth hook
  const isLoggedIn = Boolean(user); // Determine if the user is logged in

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { email, password } = form;

    if (!email || !password) {
      setMessage('Email and password must be provided');
      setLoading(false);
      return;
    }

    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    console.log('data:', data);
    console.log('error:', error);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(isLogin ? 'You are now logged in!' : 'Check your email for a confirmation link!');
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ProjectsLayout>
      <div className="relative pb-16">
        <Navigation />
        <div className="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Authentication
            </h2>
            <p className="mt-4 text-zinc-400">
              Please {isLoggedIn ? 'logout' : 'login or sign up'} to continue.
            </p>
          </div>
          <div className="w-full h-px bg-zinc-800" />
          <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
            <div className="w-full max-w-md mx-auto lg:mx-0">
              {isLoggedIn ? (
                <div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <AuthForm
                  form={form}
                  isLogin={isLogin}
                  message={message}
                  loading={loading}
                  handleFormChange={handleFormChange}
                  handleFormSubmit={handleFormSubmit}
                  toggleIsLogin={() => setIsLogin(!isLogin)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ProjectsLayout>
  );
}
