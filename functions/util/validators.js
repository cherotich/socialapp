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

exports.validateSignUpData = (data) =>
{

    let errors = {};

    if (isEmpty(data.email)) {
       errors.email = 'Must not be emty' 
    }
    else if(!isEmail(data.email))
    {
     errors.email = 'must be a valid email'
    }
    if (isEmpty(data.password))
    errors.password = 'Password must not be emtyp'
    if (data.password !==data.confirmPassword) 
     
    errors.confirmPassword = 'passwords must match'
    
    if (isEmpty(data.handle) ){
    errors.handle = 'handle cannot be empty'  
    }
   
    

    return {
        errors,
        valid:Object.keys(errors).length===0? true: false
    }

}

exports.validateLoginData = (data) =>
{

    let errors  ={};
    if (isEmpty(data.email)) {
    errors.email = errors.email='must not be empty'
 }
    if(isEmpty(data.password))errors.password = 'must not be empty'
    return {
        errors,
        valid:Object.keys(errors).length===0? true: false
    }
}
