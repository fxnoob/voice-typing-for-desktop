import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import CopyIcon from '@material-ui/icons/FileCopy';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import Title from './Title';
import languages from '../services/languages';
import { changeLanguageSR } from '../services/socketService';
import dbService from '../services/dbService';

export default function ConnectionTokenSection() {
  const [token, setToken] = useState('');
  const [lang, setLang] = useState('');
  const [languageSelectOptionOpen, setLanguageSelectOptionOpen] = useState(
    false
  );
  const {
    listen: languageChangeListen,
    emit: languageChangeEmit,
  } = changeLanguageSR();
  const closeLanguageSelectOption = () => {
    setLanguageSelectOptionOpen(false);
  };
  const changeLanguage = async (event: any) => {
    // @ts-ignore
    languageChangeEmit({
      // @ts-ignore
      langId: languages[event.target.value],
      label: event.target.value,
    });
    setLang(event.target.value);
  };
  // @ts-ignore
  useEffect(async () => {
    const { data } = await dbService.get('data');
    console.log({data});
    setLang(data.defaultLanguage.label);
    setToken(data.publicKey);
    languageChangeListen(async (val) => {
      // @ts-ignore
      console.log(val);
      // @ts-ignore
      setLang(languages[val.value.langId]);
      data.defaultLanguage.code = val.value.langId;
      // @ts-ignore
      data.defaultLanguage.label = languages[val.value.langId];
      await dbService.set('data', data);
    });
  }, []);
  return (
    <>
      <Title>
        To make it work with extension, Configure the token into the chrome
        extension.
      </Title>
      <TextField
        id="token"
        label="Connection Token"
        value={token}
        InputProps={{ endAdornment: <CopyIcon /> }}
      />
      <hr />
      <FormControl
        variant="outlined"
        style={{ marginTop: '1rem', display: 'flex' }}
      >
        <InputLabel shrink style={{ marginLeft: '-0.8rem' }}>
          language
        </InputLabel>
        <Select
          open={languageSelectOptionOpen}
          onClose={closeLanguageSelectOption}
          onOpen={() => {
            setLanguageSelectOptionOpen(true);
          }}
          value={lang}
          style={{ marginTop: '0.5rem' }}
          onChange={changeLanguage}
          inputProps={{
            name: 'name',
            id: 'open-select',
          }}
        >
          {Object.keys(languages).map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
