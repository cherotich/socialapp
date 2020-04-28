

const {db} = require('../util/admin');
const config = require('../util/config');
const firebase = require('firebase');
firebase.initializeApp(config)

const {validateSignUpData,validateLoginData} = require('../util/validators');

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

    }

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
      
    }