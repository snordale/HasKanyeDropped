export default function handler(req, res) {
  // Only available in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ message: 'Not found' });
  }

  return res.status(200).json({
    hasSpotifyClientId: !!process.env.SPOTIFY_CLIENT_ID,
    hasSpotifyClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
    nodeEnv: process.env.NODE_ENV
  });
} 