export const environment = {
  production: true,

  // Your local API if you ever use it
  
  apiUrl: 'http://localhost:4200',

  // Your Google Analytics MEASUREMENT ID (only used for page tracking)
  googleAnalyticsId: 'G-CM6W7ZZCDN',

  // Google OAuth + GA4 property (needed for real analytics data)
  google: {
    clientId: '1035165035948-e7a8fkeit9s59k11rva46b2fj35dd3nl.apps.googleusercontent.com',           // from Google Cloud
    analyticsPropertyId: '514609774'        // example: 420123456
  },

  admin: {
    usernameHash: 'bee502253f2f755248b59894497451bf986fabd464a7577d33a54f7f9c7f6d14',
    passwordHash: 'a0fb0d3b75ac917a71eac5b1596b20a3de81d32591b882ec58dfc49811f5b327'
  }
};
