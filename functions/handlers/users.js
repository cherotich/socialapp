const {admin,db} = require('../util/admin');
const config = require('../util/config');
const firebase = require('firebase');
firebase.initializeApp(config)
const {validateSignUpData,validateLoginData,reduceUserDetails} = require('../util/validators');

//signup comments
exports.signup = (req,res) => {
    const newUser ={
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };
    const {valid,errors} = validateSignUpData(newUser);
    if (!valid) 
    {
        res.status(400).json(errors);        
    }   
 const noImg = 'blank_profille.png';
    let token,userId;
    db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) =>
      {
         if (doc.exists) {
             return  res.status(400).json({handle: 'This handle is already taken' });             
         }
         else
         {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password);
          }   
     })   
      .then(data =>
               {
                   userId =data.user.uid;
            return data.user.getIdToken();         
         })
         .then(idToken =>{
             token = idToken;          
             const userCredentials ={
                 handle:newUser.handle,
                 email:newUser.email,
                 createdAt: new Date().toISOString(),
                 imageUrl :`https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                 userId
             };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);           
         })
         .then(()=> {
             return res.status(201).json({token});
         })
         .catch(err =>{
             console.error(err);
             if (err.code==='auth/email-already-in-use') {
                 return res.status(400).json({email: 'email already in use'});                 
             }
             else{
                 return res.status(500).json({general: "something went wrong please try again"});
             }            
         });
    }

//login user
    exports.login = (req,res)=>{
        const user = {
            email:req.body.email,
            password:req.body.password
        };

        const {valid,errors} = validateLoginData(user);
        if (!valid) 
        {
            res.status(400).json(errors);            
        }     
        firebase.auth()
        .signInWithEmailAndPassword(user.email,user.password)
        .then(data=>
        {
            return data.user.getIdToken();
        })  
        .then(token=>{
            return res.json({token});
        }).catch(err=>{
         console.error(err);
          
             return res.status(403).json({general: 'Wrong credentials, please try again later'});
                                  
        }) ;      
    }

//add user details
exports.addUserDetails =(req,res)=>
{
let userDetails = reduceUserDetails(req.body);
db.doc(`/users/${req.user.handle}`).update(userDetails)
.then(()=>
{
    return res.json({message: 'details added successfully'});
})
.catch(err => {
    console.error(err);
    return res.status(500).json({error:err.code});
});
};

//Get any user's details
exports.getUserDetails =(req,res) =>
{
    let userData ={};
    db.doc(`/users/${req.params.handle}`).get()
    .then(doc=>{
        if(doc.exists){
            userData.user=doc.data();
            return db.collection('screams').where('userHandle','==',req.params.handle)
            .orderBy('createdAt','desc')
            .get();
        }
        else{
            return res.status(404).json({error:'user not found'})
        }
    })
    .then(data=>{
        userData.screams =[];
        data.forEach(doc=>
            {
                userData.screams.push({
                    body:doc.data().body,
                    createdAt:doc.data().createdAt,
                    userHandle:doc.data().userHandle,
                    userImage:doc.data().userImage,
                    likeCount:doc.data().likeCount,
                    commentCount:doc.data().commentCount,
                    likeCount:doc.data().likeCount, 
                    screamId:doc.id  
                })
            });
            return res.json(userData);
    })
    .catch(err=>
        {
            console.error(err);
            return res.status(500).json({error:err.code});
        })
}

//Get own user details
exports.getAuthenticatedUser = (req,res) =>
{
let userData = {};
db.doc(`/users/${req.user.handle}`).get()
.then(doc => 
    {
        if(doc.exists)
        {
            userData.credentials = doc.data();
            return db.collection('likes').where('userHandle','==',req.user.handle).get();
        }
    })
    .then(data =>
        {
userData.likes = [];
            data.forEach(doc =>
                {
                    userData.likes.push(doc.data());
                });
                //return res.json(userData);
                return db.collection('notifications').where('recipient','==',req.user.handle)
                .orderBy('createdAt','desc').limit(10).get();
        })
        .then(data=>{
            userData.notifications=[];
            data.forEach(doc=>{
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    screamId: doc.data().screamId,
                    type: doc.data().type,
                    read: doc.data().read,
                    notificationId: doc.id


                });
            });
            return res.json(userData);
        })
        .catch(err =>
            {
                console.error(err);
                return res.status(500).json({ error: err.code});
            });


};


//upload a profile image for the user
    exports.imageUpload = (req,res)  =>
    {
const BusBoy = require('busboy');
const path = require('path');
const fs = require('fs');
const os = require('os');

const busboy = new BusBoy({headers:req.headers});
let imageFileName;
let imageToBeUploaded = {};

busboy.on('file',(fieldname,file,filename,encoding,mimetype)=>
{
    console.log(fieldname);
    console.log(filename);
    console.log(mimetype);
    //image.png
const imageExtension= filename.split('.')[filename.split('.').length-1];
 imageFileName =`${Math.round(Math.random()*100000000000)}.${imageExtension}`;

const filepath = path.join(os.tmpdir(),imageFileName);
imageToBeUploaded = {filepath,mimetype};
file.pipe(fs.createWriteStream(filepath));

// service firebase.storage {
//     match /b/{bucket}/o {
//       match /{allPaths=**} {
//         allow read, write: if request.auth != null;
//       }
//     }
//   }


});
busboy.on('finish', ()=>
{
    admin.storage().bucket().upload(imageToBeUploaded.filepath,{
        resumable:false,
        metadata :{
            metadata:{
                contentType: imageToBeUploaded.mimetype
            }
        }
    } )
    .then(()=>
    {
const imageUrl =`https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
 console.log("image url"+imageUrl);

  return db.doc(`/users/${req.user.handle}`).update({imageUrl});

})
.then(()=>
{
    return res.json({message: 'image uploaded successfully'});
 
})
.catch(err => 
    {
        console.error(err);
        return res.status(500).json({error: err.code});
    });
});
busboy.end(req.rawBody);

    };

    //mark notifications read
    exports.markNotificationsRead =(req,res)=> {
        let batch = db.batch();
        req.body.forEach(notificationId =>{
        const notification = db.doc(`/notifications/${notificationId}`)
batch.update(notification,{read:true})       
});
batch.commit()
.then(()=>{
    return res.json({message: 'notifications marked read'});

})
.catch(err =>
    {
        console.error(err);
        return res.status(500).json({error:err});
    });
    };