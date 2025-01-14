const config = {
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  },
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development'
};

const validateConfig = () => {
  const missingVars = [];

  if (!config.spotify.clientId) missingVars.push('SPOTIFY_CLIENT_ID');
  if (!config.spotify.clientSecret) missingVars.push('SPOTIFY_CLIENT_SECRET');

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      `Check your ${config.isProduction ? 'deployment settings' : '.env.local file'}.`
    );
  }

  return config;
};

export default validateConfig(); 