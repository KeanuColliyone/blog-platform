const jwt = require('jsonwebtoken');

const secret = 'c2aa4f66788b7216dc50671e3db516ef28a77998321808d5e5fde0276f14d94eed125c7b01c0a0010abc0c03b7d64342a18100db9a8218deffc35e6bfba5a24a';

const payload = {
  id: '6776cfbccb8eeb9d6d9fb580', // User's MongoDB ObjectId
  email: 'frostcolliyone@gmail.com', // User's email
};

const token = jwt.sign(payload, secret, { expiresIn: '1h' });
console.log('Generated JWT Token:', token);