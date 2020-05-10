import React from 'react'
import {Route,Redirect} from 'react-router-dom';

const AuthRoute = ({component:Component,authenthicated, ...rest }) =>( 
<Route 
{...rest}
render ={(props)=>
     authenthicated ===true ? <Redirect to ='/'/> : <Component {...props}/>
}
/>
);
export default AuthRoute;
