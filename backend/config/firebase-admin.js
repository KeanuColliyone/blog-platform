const admin = require('firebase-admin');

// Path to the service account key JSON file
const serviceAccount = require('./firebase-service-account.json'); // Adjust the path if needed

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;