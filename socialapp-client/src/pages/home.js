import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Scream from "../components/Scream";
import Profile from "../components/Profile";

import PropTypes from "prop-types";



import { connect } from "react-redux";
import { getScreams } from "../redux/actions/dataActions";

export class home extends Component {
  // _isMounted = false;

  componentDidMount() {
    this.props.getScreams();
  }
  // componentWillUnmount() {
  //   this._isMounted = false;
  // }

  render() {
    const { screams, loading } = this.props.data;
    let recentScreamsMarkUp = !loading ? (
      screams.map((scream) => 
      //console.log(scream.screamId);

        <Scream key={scream.screamid} scream={scream} />
      
        )
    ) : 
      <p> Loading ....</p>;
    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkUp}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getScreams })(home);
