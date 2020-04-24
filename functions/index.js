const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();


admin.initializeApp();

var firebaseConfig = {
    apiKey: "AIzaSyDlcU3tb-4he9C0fkUg8o5apzK4scYgANw",
    authDomain: "socialapp-8f164.firebaseapp.com",
    databaseURL: "https://socialapp-8f164.firebaseio.com",
    projectId: "socialapp-8f164",
    storageBucket: "socialapp-8f164.appspot.com",
    messagingSenderId: "19174856358",
    appId: "1:19174856358:web:9aa22d7a9f7fa67e270667",
    measurementId: "G-VHFMN9MK49"
  };



const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);
const db = admin.firestore();

app.get('/screams', (req,res) => {

   db
    .collection('screams')
    .orderBy('createdAt','desc')
    .get()
.then(data=>{
    let screams = [];
data.forEach(doc =>{
    screams.push({
        screamid: doc.id,
        body: doc.data().body,
        userHandle: doc.data().userHandle,
        createdAt: doc.data().createdAt,
   commentCount:doc.data().commentCount,
   likeCount:doc.data().likeCount
   
    });
});
return res.json(screams);
})
.catch((err) =>
{
    console.error(err);
    res.status(500).json({error:err.code});

}  );

});


//auth middleware
const FBAuth = (req,res,next) =>
{
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ' )) {
      idToken = req.headers.authorization.split('Bearer ')[1];

    }
    else{
        console.error('no token found');
        return res.status(403).json({error :'Unauthorized'});

    }
    admin.auth().verifyIdToken(idToken)
    .then(decodedToken =>{
        req.user = decodedToken;
        console.log(decodedToken);
        return db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then(data =>{ 
        req.user.handle =data.docs[0].data().handle;
        return next();
    })
    .catch(err =>
        {
            console.error('error while verifying token',err);
        return res.status(403).json(err);
            })
}


//new scream route
   app.post('/scream',FBAuth, (req, res) => {
    //    if (req.method !== 'POST') {
    //        return res.status(400).json({error: 'method not allowed'});
           
    //    }
       if (req.body.body.trim()==='') {
          return res.status(400).json({body: 'body  must not be empty'}); 
       }
  const newScream ={
      body:req.body.body,
      userHandle: req.user.handle,
      createdAt:new Date().toISOString()
  };
//add new scream
db
  .collection('screams')
  .add(newScream)
  .then(doc =>
    {
res.json({message: `document ${doc.id} created successfully`});

    })
   .catch(err =>{
        res.status(500).json({ error:   'something went wrong'});
   console.error(err);
   
    })

       });


       const isEmail =(email) =>
       {
           const regEx =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
           if(email.match(regEx))
           return true;
           else
           return false;
       }
       //check empty data
       const isEmpty = (string)=>
       {
           if (string.trim()==='') {
             return true;  
           }
           else
           {
               return false;
           }

       }
       
       //signup route
       app.post('/signup',(req,res) => {
       const newUser ={
           email: req.body.email,
           password: req.body.password,
           confirmPassword: req.body.confirmPassword,
           handle: req.body.handle,

       };
       let errors = {};

       if (isEmpty(newUser.email)) {
          errors.email = 'Must not be emty' 
       }
       else if(!isEmail(newUser.email))
    {
        errors.email = 'must be a valid email'
    }
    if (isEmpty(newUser.password))
    errors.password = 'Password must not be emtyp'
    if (newUser.password !==newUser.confirmPassword) 
        
  errors.confirmPassword = 'passwords must match'
    
    if (isEmpty(newUser.handle) ){
      errors.handle = 'handle cannot be empty'  
    }

    if (Object.keys(errors).length>0) {
return res.status(400).json({errors});      
    }
       //todo:validate data

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
                    return res.status(500).json({error: err.code});
                }
               
            });

       });

       //login route
       app.post('/login',(req,res)=>{
           const user = {
               email:req.body.email,
               password:req.body.password
           };
           let errors  ={};
           if (isEmpty(user.email)) {
           errors.email = errors.email='must not be empty'
        }
           if(isEmpty(user.password))errors.password = 'must not be empty'
           firebase.auth().signInWithEmailAndPassword(user.email,user.password)
           .then(data=>
           {
               return data.user.getIdToken();
           })  
           .then(token=>{
               return res.json({token});
           }).catch(err=>{
            console.error(err);
            //    if (err.code==='auth/user-not-found') {
            //     errors.email = 'Ensure that the email is correct'
            //    }
            //    else 
               if (err.code==='auth/wrong-password') {
                return res.status(403).json({general: 'Wrong credentials, please try again later'});
               }
               else{
                return res.status(500).json({error: err.code});
               }
             
             
           }) ;
         
       });

       exports.api = functions.region('europe-west1').https.onRequest(app);