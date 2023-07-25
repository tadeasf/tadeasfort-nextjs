"use client";

import React, { useEffect } from 'react';
import axios from 'axios';

export function Analytics() {
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  useEffect(() => {
    // Get the current page slug
    const slug = window.location.pathname;

    // Send a POST request to your `/api/incr` endpoint
    axios.post('/api/incr', { slug })
      .then(response => {
        console.log('Response:', response);
      })
      .catch(error => {
        console.error('Error incrementing page view count:', error);
      });
  }, []);

  if (!googleAnalyticsId) {
    return null;
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `,
        }}
      />
    </>
  );
}
