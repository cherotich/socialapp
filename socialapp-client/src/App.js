import React, { Component } from 'react'
//import React from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';

import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

//components
import Navbar from './components/Navbar';

//pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode';
import AuthRoute from './util/AuthRoute';
const theme = createMuiTheme(themeFile);

let authenticated;
const token = localStorage.FBIdToken;
if(token){
const decodedToken = jwtDecode(token);
if(decodedToken.exp *1000<Date.now()){

  window.location.href='/login'
authenticated ='false'
}
else {
  authenticated='true'
}
}


class App extends Component {
  render() {
    return (
<MuiThemeProvider theme ={theme}>
<div className ="App">
        <Router>
        <Navbar/>
        <div className="container">
      

<Switch>
  <Route exact path = "/" component ={home}/>
  <AuthRoute exact path = "/login" component ={login} authenthicated ={authenthicated}/>
  <AuthRoute exact path = "/signup" component ={signup} authenthicated ={authenthicated}/>
</Switch>
        </div>
        </Router>
      </div>

</MuiThemeProvider>
    );
  }
}

export default App


