

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
   
    });

       };

       //getscream 
       exports.getScream = (req,res)=>
       {
           let screamData = {};
           db
           .doc(`/screams/${req.params.screamId}`)
           .get()
           .then((doc)=> 
            {
                console.
            log(doc);
                if (!doc.exists) {
                    return res.status(404).json({message:'scream not found'});

                }
                screamData = doc.data();
                screamData.screamid = doc.id;
                return db
                .collection('comments')
                .orderBy('createdAt','desc')
                .where('screamId','==',req.params.screamId)
                .get();

            })
            .then(data =>
                {
                    screamData.comments = [];
                    data.forEach((doc)=>
                        {
                            screamData.comments.push(doc.data());
                        });
                        return res.json(screamData);

                })
                .catch(err =>{
                    console.error(err);
                    res.status(500).json({error: err.code})
                });

       };

       //comment on a comment
       exports.commentOnScream = (req,res) =>
       {

        if (req.body.body.trim()==='') {
            return res.status(400).json({error: ' must not be empty'})
            
        }
        const newComment ={
            body: req.body.body,
            createdAt: new Date().toISOString(),
            screamId: req.params.screamId,
            userHandle:req.user.handle,
            userImage: req.user.imageUrl
        };
db
.doc(`/screams/${req.params.screamId}`)
.get()
.then((doc)=>{
    if(!doc.exists){
        return res.status(404).json({error:'scream does not exist anymore'})
    }
    return db.collection('comments').add(newComment)
})
.then(()=>
{
    res.json(newComment);
})
.catch(err=>{
    console.log(err);
    res.status(500).json({error:err.code});

})


       }
