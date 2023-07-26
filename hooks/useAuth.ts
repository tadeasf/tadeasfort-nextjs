import { useState, useEffect } from 'react';
import { supabase } from 'util/supabaseClient';
import { User } from '@supabase/supabase-js';

function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Subscribe to user changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        fetchUser(); // Fetch user data when logged in
      } else if (event === 'SIGNED_OUT') {
        setUser(null); // Clear user data when logged out
      }
    });

    // Check active user on mount
    fetchUser();

    // Function to fetch user data
    async function fetchUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user); // Extract the user from the response and set it
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    // Unsubscribe on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return user;
}

export default useAuth;
