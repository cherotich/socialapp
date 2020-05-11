import React, { Component } from 'react'
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Scream from '../components/Scream';

export class home extends Component {
    _isMounted = false;
    
  state= {
      screams:null
  }
    componentDidMount(){
        _isMounted = true;
      axios.get('/screams')
      .then(res =>{
          console.log(res.data)
          this.setState({
              screams:res.data
          })
      })
      .catch(err => console.log(err));
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  
    render() {
        let recentScreamsMarkUp = this.state.screams ? (
            this.state.screams.map(scream => <Scream key ={scream.screamId} scream={scream}/> )
        ): <p> Loading ....</p>
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                  
{recentScreamsMarkUp}
                  
                    </Grid> 
                    <Grid item sm={4} xs={12}>
                    <p> Profile ..</p>
                    </Grid> 
            </Grid>
           
        );
    }
}

export default home;
