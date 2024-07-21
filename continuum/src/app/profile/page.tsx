"use client";

import { useEffect, useState } from 'react';

const getProfile = async (accessToken?: string): Promise<any> => {
  const token = accessToken || localStorage.getItem('access_token');

  if (!token) {
    throw new Error('Access token not found');
  }

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Access token expired');
    }
    throw new Error('Failed to fetch profile');
  }

  return response.json();
}

const getAllPlaylists = async (accessToken?: string): Promise<any> => {
  const token = accessToken || localStorage.getItem('access_token');

  if (!token) {
    throw new Error('Access token not found');
  }

  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Access token expired');
    }
    throw new Error('Failed to fetch playlists');
  }

  return response.json();
}

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [playlists, setPlaylists] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);

        const playlistsData = await getAllPlaylists();
        setPlaylists(playlistsData);
      } catch (error: any) {
        if (error.message === 'Access token expired') {
          // Handle token refresh logic here if implemented
          setError('Access token expired. Please log in again.');
        } else {
          setError(error.message);
        }
      }
    };

    fetchProfileData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile || !playlists) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <title>My Spotify Profile</title>

      <h1>Spotify Profile Data</h1>

      <section id="profile">
        <h2>Logged in as <span id="displayName">{profile.display_name}</span></h2>
        {profile.images?.[0]?.url && <img id="avatar" src={profile.images[0].url} alt="Profile Avatar" />}
        <ul>
          <li>User ID: <span id="id">{profile.id}</span></li>
          <li>Email: <span id="email">{profile.email}</span></li>
          <li>Spotify URI: <a id="uri" href={profile.uri}>{profile.uri}</a></li>
          <li>Link: <a id="url" href={profile.external_urls.spotify}>{profile.external_urls.spotify}</a></li>
          {profile.images?.[0]?.url && <li>Profile Image: <span id="imgUrl">{profile.images[0].url}</span></li>}
        </ul>
      </section>

      <h1>All Playlists:</h1>
      <section id="playlists">
        <ul>
          {playlists.items.map((playlist: any) => (
            <li key={playlist.id}>
              <h3>{playlist.name}</h3>
              {playlist.images?.[0]?.url && (
                <img src={playlist.images[0].url} alt={playlist.name} width="100" height="100" />
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Profile;
