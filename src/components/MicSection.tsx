import React, { useState, useEffect } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import { toggleSR } from '../services/socketService';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
    margin: '1rem',
    marginLeft: '-.1rem',
    fontSize: '2rem',
  },
});

export default function MicSection(props: { callback: any }) {
  const { callback } = props;
  const classes = useStyles();
  const [listening, setListening] = useState(false);
  // @ts-ignore
  const [langId, setlangId] = useState(null);
  const { listen, emit } = toggleSR();
  const toggleListening = () => {
    emit(listening);
  };
  useEffect(() => {
    listen((data) => {
      console.log('listen', data);
      setListening(data.value.listening);
      setlangId(data.value.langId);
      callback({
        listening: data.value.listening,
        langId: data.value.langId,
        langLabel: data.value.langLabel,
      });
    });
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <FormControlLabel
        aria-label=""
        data-balloon-pos="right"
        control={
          <Fab
            onClick={toggleListening}
            style={{
              height: '6rem',
              width: '6rem',
              background: listening ? '#f50057' : '',
            }}
            variant="extended"
          >
            <KeyboardVoiceIcon />
          </Fab>
        }
        label=""
      />
      <Typography color="textSecondary" className={classes.depositContext}>
        {listening ? 'Listening.' : 'Start!'}
      </Typography>
    </div>
  );
}
