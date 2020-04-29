const functions = require('firebase-functions');
// const {db} = require('./util/admin');

// const {admin} = require('./util/admin');
const app = require('express')();
const {Fbauth } = require('./util/fbAuth.js');

const {getAllScreams,postOneScream} = require('./handlers/screams');
const {
    signup,
    login,
    imageUpload,
    addUserDetails,  
    getAuthenticatedUser} = require('./handlers/users');

//user routes
 //signup route
 app.post('/signup',signup);
 //login route
 app.post('/login',login);   


//scream routes
app.get('/screams',getAllScreams );
//post one scream
app.post('/scream',Fbauth,postOneScream);
       //upload image
app.post('/user/image',Fbauth,imageUpload);  
app.post('/user', Fbauth,addUserDetails)    
app.get('/user', Fbauth,getAuthenticatedUser);


exports.api = functions.region('europe-west1').https.onRequest(app);

