export default (process.env.NODE_ENV === 'production') ? (
  {
    urls: {
      loginViaGoogle: '/auth/google',
      logout: '/auth/logout'
    }    
  }
) : (
  {
    urls: {
      loginViaGoogle: 'http://localhost:3001/auth/google',
      logout: 'http://localhost:3001/auth/logout'
    }
  }
);

