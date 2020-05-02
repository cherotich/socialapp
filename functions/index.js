const functions = require('firebase-functions');
const app = require('express')();
const {Fbauth } = require('./util/fbAuth.js');
const {
    getAllScreams,
    getScream,
    postOneScream,
    commentOnScream
} = require('./handlers/screams');
const {
    signup,
    login,
    imageUpload,
    addUserDetails,  
    getAuthenticatedUser
    
} = require('./handlers/users');

//user routes
 app.post('/signup',signup);
 app.post('/login',login); 
 app.post('/user/image',Fbauth,imageUpload);  
app.post('/user', Fbauth,addUserDetails)    
app.get('/user', Fbauth,getAuthenticatedUser);

//scream routes
app.get('/screams',getAllScreams );
app.post('/scream',Fbauth,postOneScream);
app.get('/scream/:screamId',getScream);
app.post('/scream/:screamId/comment',Fbauth,commentOnScream);

//todo delete scream,like a scream,unlike a scream,comment on scream,



exports.api = functions.region('europe-west1').https.onRequest(app);

