import React, { Component } from 'react'
//import React from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';

import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import themeFile from './util/theme';
//components
import Navbar from './components/Navbar';

//pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
//REDUX 
import {Provider} from 'react-redux';
import  store from './redux/store';

import jwtDecode from 'jwt-decode';
import AuthRoute from './util/AuthRoute';
const theme = createMuiTheme(themeFile);


let authenticated;
const token = localStorage.FBIdToken;
if(token){
  console.log(token)
const decodedToken = jwtDecode(token);
console.log(decodedToken)
if(decodedToken.exp *1000<Date.now()){

  window.location.href='/login'
  authenticated =false;
}
else {
  authenticated=true;
}
}


class App extends Component {
  render() {
    return (
<MuiThemeProvider theme ={theme}>
<Provider store={store}>

        <Router>
        <Navbar/>
        <div className="container">
      

<Switch>
  <Route exact path = "/" component ={home}/>
  <AuthRoute exact path = "/login" component ={login} authenticated ={authenticated}/>
  <AuthRoute exact path = "/signup" component ={signup} authenticated ={authenticated}/>
</Switch>
        </div>
        </Router>
  
 

</Provider>

</MuiThemeProvider>
    );
  }
}

export default App


