"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const clientId = '34e26fb8e1ed44038e1d37fed250886c';
const redirectUri = 'http://localhost:3000/callback';

const getToken = async (code: string): Promise<void> => {
  const codeVerifier = localStorage.getItem('code_verifier');

  if (!codeVerifier) {
    throw new Error('Code verifier not found in local storage');
  }

  const payload: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', payload);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch access token: ${errorText}`);
    }
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
}

const Callback = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProfile = async () => {
      const code = searchParams.get('code');
      console.log('Authorization code:', code); // Log the authorization code

      if (code) {
        try {
          await getToken(code);
          router.push('/profile');
        } catch (error) {
          console.error('Error in fetchProfile:', error);
          setError('Failed to fetch access token.');
        }
      } else {
        console.error('No code found in query parameters.'); // Log the absence of code
        setError('No code found in query parameters.');
      }
    };

    fetchProfile();
  }, [searchParams, router]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Loading...</div>;
};

export default Callback;
