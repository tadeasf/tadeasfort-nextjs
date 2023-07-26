import React, { useState, useEffect } from 'react';
import { supabase } from '../util/supabaseClient';
import { useRouter } from 'next/router';
import { Session } from '@supabase/supabase-js';
import AuthForm from 'app/components/authForm';

export default function Auth() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          router.push('/'); // redirect to home page after login
        } else if (event === 'SIGNED_OUT') {
          router.push('/auth'); // redirect to auth page after logout
        }
      }
    );
  
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  

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
  

  return (
    <AuthForm
      form={form}
      isLogin={isLogin}
      message={message}
      loading={loading}
      handleFormChange={handleFormChange}
      handleFormSubmit={handleFormSubmit}
      toggleIsLogin={() => setIsLogin(!isLogin)}
    />
  );
};
