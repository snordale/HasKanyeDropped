const album_ids = new Set([
  '0FgZKfoU2Br5sHOfvZKTI9',
  '6pwuKxMUkNg673KETsXPUV',
  '2Ek1q2haOnxVqhvVKqMvJe',
  '7gsWAHLeT0w7es6FofOXk1',
  '7D2NdGvBHIavgLhmcwhluK',
  '0A3g19AGFd9Qe3rAIkP8e0',
  '7mCeLbChyegbRwwKK5shJs',
  '20r762YmB5HeofjMCiPMLv',
  '3WFTGIO6E3Xh4paEOBY9OU',
  '5fPglEDz9YEwRgbLRvhCZy',
  '5ll74bqtkcXlKE7wwkMq4g',
  '4Uv86qWpGTxf7fU7lG5X6F',
]);

async function getKanye() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

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

  body.items.forEach((album) => {
    const today = new Date('2021-08-10');
    const releaseDate = new Date(album.release_date);

    if (!(album.name in albums.data) && (album_ids.has(album.id) || releaseDate > today)) {
      albums.order.push(album.name);
      albums.data[album.name] = {
        'name': album.name,
        'uri': album.uri,
        'imageUrl': album.images[0].url,
        'releaseDate': album.release_date
      };
    }
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