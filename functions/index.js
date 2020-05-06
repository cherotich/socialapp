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
return db.doc(`/screams/${snapshot.data().screamId}`)
.get()
.then(doc=>
    {
        if (doc.exists&& doc.data().userHandle!==snapshot.data().userHandle) {
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
  return  db.doc(`/notifications/${snapshot.id}`)
    .delete()
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


return db.doc(`/screams/${snapshot.data().screamId}`).get()
.then(doc=>
    {
        if (doc.exists&& doc.data().userHandle!==snapshot.data().userHandle) {
          
            return db.doc(`/notifications/${snapshot.id}`)
.set({    createdAt: new Date().toISOString(),
    recipient : doc.data().userHandle,
    sender: snapshot.data().userHandle,
    type : 'comment',
    read: false,
    screamId: doc.id})
        }
    })
    .catch(err=>
        {
            console.error(err);
            return;
        });

});

exports.onUserImageChange = functions
.region('europe-west1')
.firestore
.document('/users/{userId}')
.onUpdate(change =>{
    console.log(change.before.data());
    console.log(change.after.data());

if(change.before.data().imageUrl!== change.after.data().imageUrl)
{
    console.log('image changed');
    const batch = db.batch();
    return db
    .collection('screams')
    .where('userHandle','==',change.before.data().handle )
   .get()
    .then(data => {
        data.forEach(doc => {
            const scream=db.doc(`/screams/${doc.id}`);
            batch.update(scream,{userImage: change.after.data().imageUrl});
            // const comment=db.doc(`/comments/${doc.id}`);
            // batch.update(comment,{userImage: change.after.data().imageUrl});

        });
        return batch.commit();
    });
}
else return true;


});

exports.onScreamDelete = functions
.region('europe-west1')
.firestore
.document('/screams/{screamId}')
.onDelete((snapshot,context)=>{
    const screamId =context.params.screamId;
    const batch= db.batch();
    return db.collection('comments').where('screamId','==',screamId).get()
    .then(data=>{
        data.forEach(doc=>{
            batch.delete(db.doc(`/comments/${doc.id}`));
        })
        return db.collection('likes').where('screamId','==', screamId).get();

    })
    .then(data=>{
        data.forEach(doc=>{
            batch.delete(db.doc(`/likes/${doc.id}`));
        })
        return db.collection('notifications').where('screamId','==', screamId).get();
        
    })
    .then(data=>{
        data.forEach(doc=>{
            batch.delete(db.doc(`/notifications/${doc.id}`));
            console.log('notifications deleted');
        })
return batch.commit();     
    })
    .catch(err=>  console.error(err)

    );
});


