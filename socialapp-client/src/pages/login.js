import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import AppIcon from '../images/icon2.png';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const styles ={
form:{
    textAlign: 'center'
},
image:{
    margin: '20px auto 20px auto'
},
pageTitle: {
    margin: '10px auto 10px auto'
},
TextField:{
    margin: '10px auto 10px auto'
},
button:{
  marginTop:  20
}
}


class login extends Component {

    constructor(){
        super();
        this.state = {
            email:'',
            password:'',
            loading: false,
            errors:{}

        };
    }
    handleSubmit=(event) =>{
      
        event.preventDefault();
        this.setState(
         {  
              loading: true
            }
        );
        const userData={
email:this.state.email,
password:this.state.password

        }
        axios.post('/login')
        .then(res=>{
            console.log(res.data);
            loading.setState({
                loading:false
            });
            this.props.history.push('/');
        })
        .catch(err=>{
            this.setState({
errors:err.res.data,
loading:false
            })
        })
    };
    handleChange =(event)=>{
this.setState({
    [event.target.name]: event.target.value
})
    };
    render() {
        const {classes} = this.props;
        const {errors,loading} = this.state;
        return (

       <Grid container className={classes.form}>
           <Grid item sm/>
           <Grid item sm>
           <img src ={AppIcon} alt ="app icon" className ={classes.image}/>
           <Typography variant ="h2" className={classes.pageTitle}>
               Login
           </Typography>
           <form noValidate onSubmit={this.handleSubmit}>
               <TextField id="email"
                name="email" type ="email"
                 label ="Email"
                 className={classes.TextField}
                 helperText ={errors.email}
                 error ={errors.email ?  true: false}
               value ={this.state.email} 
               onChange ={this.handleChange}
                fullWidth/>
           </form>
           <TextField id="password" 
           name="password" 
           type ="password" 
           label ="Password" 
           className={classes.TextField}
           helperText ={errors.password}
           error ={errors.password ?  true: false}
           value ={this.state.password} 
           onChange ={this.handleChange}
            fullWidth/>
           
           <Button type ="submit" 
           variant="contained" 
           color="primary" 
           className={classes.Button} >
               Login
           </Button>
           </Grid>
           <Grid item sm/>   
       </Grid>
        );
    }
    
}

login.propTypes={
    classes:PropTypes.object.isRequired
 }
export default withStyles(styles)(login)