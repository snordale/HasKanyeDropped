const config = {
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  }
};

const validateConfig = () => {
  if (!config.spotify.clientId) {
    throw new Error('SPOTIFY_CLIENT_ID is required');
  }
  if (!config.spotify.clientSecret) {
    throw new Error('SPOTIFY_CLIENT_SECRET is required');
  }
  return config;
};

export default validateConfig(); 