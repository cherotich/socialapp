const functions = require('firebase-functions');
// const {db} = require('./util/admin');

// const {admin} = require('./util/admin');
const app = require('express')();
const {Fbauth } = require('./util/fbAuth.js');

const {getAllScreams,postOneScream} = require('./handlers/screams');
const {signup,login} = require('./handlers/users');


//scream route
app.get('/screams',getAllScreams );
//post one scream
app.post('/scream',Fbauth,postOneScream);
       //signup route
       app.post('/signup',signup);
       //login route
       app.post('/login',login);   
       exports.api = functions.region('europe-west1').https.onRequest(app);

