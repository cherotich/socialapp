

const {db} = require('../util/admin');
exports.getAllScreams = (req,res) => {

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
 
 }

 //post one scream

 exports.postOneScream =  (req, res) => {
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

       }