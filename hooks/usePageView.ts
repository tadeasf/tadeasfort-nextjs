import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export function usePageView() {
  const router = useRouter();

  useEffect(() => {
    const incrementPageView = async () => {
      try {
        await axios.post('/api/incr', { slug: router.asPath });
      } catch (error) {
        console.error('Failed to increment page view:', error);
      }
    };

    incrementPageView();
  }, [router.asPath]);
}
