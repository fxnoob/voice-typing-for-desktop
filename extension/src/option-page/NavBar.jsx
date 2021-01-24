import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    textAlign: "center",
    color: "#081f43",
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

const ButtonAppBar = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        style={{ background: "#ffffff", boxShadow: "none" }}
      >
        <Toolbar>
          <Typography variant="h6" className={classes.grow}>
            Voice Typing for Desktop
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);
