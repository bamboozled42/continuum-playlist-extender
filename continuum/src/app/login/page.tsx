"use client";

import { useEffect } from 'react';

const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const clientId = '34e26fb8e1ed44038e1d37fed250886c';
const redirectUri = 'http://localhost:3000/callback';
const scope = 'user-read-private user-read-email';
const authUrl = new URL("https://accounts.spotify.com/authorize");

export default function Login() {
  useEffect(() => {
    const setup = async () => {
      const codeVerifier: string = generateRandomString(64);
      window.localStorage.setItem('code_verifier', codeVerifier);

      const hashed = await sha256(codeVerifier);
      const codeChallenge = base64encode(hashed);

      const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
      };

      authUrl.search = new URLSearchParams(params).toString();
      window.location.href = authUrl.toString();
    };

    setup();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <title>Login with Spotify</title>
      <h1>Redirecting to Spotify login...</h1>
    </main>
  );
}
