import React from 'react';
import Lottie from 'lottie-react-web';
import Button from '@material-ui/core/Button';
import loaderJson from './44359-ecology-isometric-animation.json';

export default (props: any) => {
  const { message } = props;
  return (
    <div>
      <p>{message}</p>
      <Button
        style={{ marginBottom: '1rem' }}
        onClick={props.check}
        variant="contained"
        color="secondary"
      >
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
