import { createDeflateRaw } from "zlib";

let db ={

    users:[
        {
            userId: 'vMIvkbWbumRyXQzOC9Uzq2Rj2i32',
            email:'limo@gmail.com',
            handle:'limo',
            createdAt:'2020-04-28T17:41:11.777Z',
            imageUrl:'image/fdfdrfggfcggggggggg/dfsd',
            bio: 'Hello, my name is Limo, Happy to meet you',
            website: 'https://limo.com',
            location:'Nairobi,Kenya'


        }
    ],
    screams:
    [{

    
        userHandle: 'user',
        body: 'this is the scream body',
        createdAt: '2020-04-22T17:07:02.022Z',
        likeCount: 5,
        commentCount :3
    }
    ],
    comments:[
        {
           userHandle:'limo',
           screamId:'8o0hqoEjV9n3zUHDB3jn',
           body:'Scream3 by limo',
           createdAt:'2020-04-29T18:24:37.224Z'
        }
    ]
};


notifications: [
    {
        recipient: 'user',
        sende: 'limo',
        read: 'true | false',
        screamId: 'ftqargd',
        type: 'like | comment',
        createdAt :'2020-04-22T17:07:02.022Z'
    }
]
const userDetails ={
    //Redux data
    credentials :{ 
    userId: 'vMIvkbWbumRyXQzOC9Uzq2Rj2i32',
    email:'limo@gmail.com',
    handle:'limo',
    createdAt:'2020-04-28T17:41:11.777Z',
    imageUrl:'image/fdfdrfggfcggggggggg/dfsd',
    bio: 'Hello, my name is Limo, Happy to meet you',
    website: 'https://limo.com',
    location:'Nairobi,Kenya'
    },
    likes: [{

        userHandle: 'user',
        screamId : '8o0hqoEjV9n3zUHDB3jn'

    },
    {
        userHandle: 'user',
        screamId : 'CJ3ur7uqkNMb9LCPuPsT'
    }
    ]
};