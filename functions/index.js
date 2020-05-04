const functions = require('firebase-functions');
const app = require('express')();
const {Fbauth } = require('./util/fbAuth.js');

const {db} = require('./util/admin');
const {
    getAllScreams,
    getScream,
    postOneScream,
    commentOnScream,
    unlikeScream,
    deleteScream,
    likeScream
} = require('./handlers/screams');
const {
    signup,
    login,
    imageUpload,
    addUserDetails,  
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
    
} = require('./handlers/users');

//user routes
 app.post('/signup',signup);
 app.post('/login',login); 
 app.post('/user/image',Fbauth,imageUpload);  
app.post('/user', Fbauth,addUserDetails)    
app.get('/user', Fbauth,getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications',Fbauth, markNotificationsRead);

//scream routes
app.get('/screams',getAllScreams );
app.post('/scream',Fbauth,postOneScream);
app.get('/scream/:screamId',getScream);
app.post('/scream/:screamId/comment',Fbauth,commentOnScream);
app.get('/scream/:screamId/like', Fbauth, likeScream);
app.get('/scream/:screamId/unlike', Fbauth, unlikeScream);
app.delete('/scream/:screamId', Fbauth,deleteScream)
//todo delete scream,like a scream,unlike a scream,comment on scream,



exports.api = functions.region('europe-west1').https.onRequest(app);

exports.createNotificationOnLike = functions
.region('europe-west1')
.firestore
.document('likes/{id}')
.onCreate((snapshot)=>
{
db.doc(`/screams/${snapshot.data().screamId}`)
.get()
.then(doc=>
    {
        if (doc.exists) {
            const notificationsLike = {
                createdAt: new Date().toISOString(),
                recipient : doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type : 'like',
                read: false,
                screamId: doc.id
            };
            return db.doc(`/notifications/${snapshot.id}`)
.set({notificationsLike});
        }
    })
    .then(()=>
    {
        return;
    })
    .catch(err=>
        {
            console.error(err);
           
            // res.status(500).json({error: err.code});
        });
});


exports.deleteNotificationOnUnlike =functions
.region('europe-west1')
.firestore
.document('likes/{id}')
.onDelete((snapshot)=>{
    db.doc(`/notifications/${snapshot.id}`)
    .delete()
    .then(()=>{
        return;
    })
    .catch(err=>
        {
            console.error(err);
            return;
        });
} );


exports.createNotificationOnComment = functions
.region('europe-west1')
.firestore
.document('comments/{id}')
.onCreate((snapshot)=>
{


db.doc(`/screams/${snapshot.data().screamId}`).get()
.then(doc=>
    {
        if (doc.exists) {
            const notificationComment ={
                createdAt: new Date().toISOString(),
                recipient : doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type : 'comment',
                read: false,
                screamId: doc.id
            }
            return db.doc(`/notifications/${snapshot.id}`)
.set({ notificationComment})
        }
    })
    .then(()=>
    {
        return;
    })
    .catch(err=>
        {
            console.error(err);
            return;
        });

});


