import React, { useEffect } from 'react';
import Lottie from 'lottie-react-web';
import loaderJson from './44359-ecology-isometric-animation.json';
import Button from '@material-ui/core/Button';

export default (props) => {
  return (
    <div>
      <p>
        Trying to connect to the chrome extension..! Make sure you have
        downloaded the chrome extension and chrome is open.
      </p>
      <Button style={{marginBottom: '1rem'}} onClick={props.check} variant="contained" color="secondary">
        Connect Again!
      </Button>
      <Lottie
        options={{
          animationData: loaderJson,
        }}
      />
    </div>
  );
};
