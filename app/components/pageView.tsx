// components/PageView.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function PageView() {
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

  return null; // this component does not render anything
}
