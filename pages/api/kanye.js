import config from '../../lib/config';

async function getKanye() {
  const client_id = config.spotify.clientId;
  const client_secret = config.spotify.clientSecret;

  const authResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    })
  });

  const authData = await authResponse.json();
  const accessToken = authData.access_token;

  const artistResponse = await fetch('https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x', {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });

  const artistData = await artistResponse.json();

  return {
    'artist': artistData.name,
    'uri': artistData.uri,
    'popularity': artistData.popularity,
    'imageUrl': artistData.images[0].url,
    'accessToken': accessToken
  };
}

async function getAlbums(accessToken) {
  const response = await fetch(
    'https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x/albums?market=US&limit=50',
    {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }
  );

  const body = await response.json();
  const albums = {
    'data': {},
    'order': []
  };

  const uniqueAlbums = new Map();
  body.items.forEach((album) => {
    if (!uniqueAlbums.has(album.name) || 
        new Date(album.release_date) > new Date(uniqueAlbums.get(album.name).release_date)) {
      uniqueAlbums.set(album.name, album);
    }
  });

  const sortedAlbums = Array.from(uniqueAlbums.values())
    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

  sortedAlbums.forEach((album) => {
    albums.order.push(album.name);
    albums.data[album.name] = {
      'name': album.name,
      'uri': album.uri,
      'imageUrl': album.images[0].url,
      'releaseDate': album.release_date
    };
  });

  return albums;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new Error('Missing Spotify credentials');
    }

    const kanye = await getKanye();
    const albums = await getAlbums(kanye.accessToken);
    
    if (!kanye || !albums) {
      throw new Error('Failed to fetch data');
    }

    res.status(200).json({
      kanye,
      albums
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(error.message === 'Missing Spotify credentials' ? 500 : 503).json({ 
      message: error.message || 'Internal server error'
    });
  }
} 