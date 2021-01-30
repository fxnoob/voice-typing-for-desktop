import React from 'react';
import Button from '@material-ui/core/Button';

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
    </div>
  );
};
