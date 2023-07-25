import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export function usePageView() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      axios.post('/api/pageview', { path: url });
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
}
