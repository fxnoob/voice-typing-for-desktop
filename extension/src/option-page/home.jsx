import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import SpeechRecognitionSettings from "./speechRecognitionsSetting";

const styles = theme => ({
  root: {
    width: "100%",
    flexGrow: 1,
    maxWidth: 700,
    backgroundColor: theme.palette.background.paper
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class Home extends React.Component {
  render() {
    return (
      <Container
        style={{
          marginTop: "3rem",
          marginBottom: "3rem",
          maxWidth: "500px"
        }}
      >
        <Grid
          container
          spacing={10}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <SpeechRecognitionSettings />
        </Grid>
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          Creator @ <a href="mailto:fxnoob71@gmail.com">Hitesh Saini</a>
        </div>
      </Container>
    );
  }
}
export default withStyles(styles)(Home);
