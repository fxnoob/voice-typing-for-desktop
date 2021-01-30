import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import MUIDataTable from 'mui-datatables';
import Checkbox from '@material-ui/core/Checkbox';
import db, {schema} from '../services/dbService';
import translationService from '../services/translationService';
import commandService from '../services/commandsService';
import languages from '../services/languages';
import { changeLanguageSR } from '../services/socketService';

const {
  listen: languageChangeListen,
} = changeLanguageSR();
const CommandList = (props: { langId: any; langLabel: any }) => {
  const { langId, langLabel } = props;
  const columns = [
    translationService.getMessage(langId, 'command_name_label'),
    translationService.getMessage(langId, 'command_description_label'),
    translationService.getMessage(langId, 'command_enable_disable_label'),
  ];
  const [language, setLanguage] = useState('');
  const [data, setData] = useState([]);
  const init = async (languageData) => {
    const { langId, langLabel } = languageData;
    const { commandsConfig } = (await db.get('commandsConfig')) || {};
    setLanguage(langLabel);
    const commandsJson = await commandService.getCommands(langId? langId : schema.data.defaultLanguage.code);
    const commandsList: any = commandsJson.map((command) => {
      return [
        command.name,
        command.description,
        <Checkbox
          key={command.id}
          checked={commandsConfig[command.id]}
          /* eslint-disable no-use-before-define */
          onChange={handleChange(command.id, commandsConfig)}
          inputProps={{ 'aria-label': 'enable/disable command' }}
        />,
      ];
    });
    setData(commandsList);
  };
  const handleChange = (id: string, arr: { [x: string]: any }) => async () => {
    arr[id] = !arr[id];
    await db.set('cmd', { commandsConfig: arr });
    init({props}).catch(() => {});
  };
  useEffect(() => {
    init(props).catch(() => {});
    languageChangeListen(async (val) => {
      console.log("underCommandList languageChangeListen", val);
      const label = val.value.label ? val.value.label : schema.data.defaultLanguage.label
      const language = {
        langId: languages[label] ? languages[label] : schema.data.defaultLanguage.code,
        langLabel: label
      }
      init(language).catch(() => {});
    });
  }, []);
  const options = {
    rowsPerPage: 13,
    selectableRows: false,
  };
  return (
    <Container>
      <MUIDataTable
        title={`${translationService.getMessage(
          langId,
          'commands_list_label'
        )}: ${language}`}
        data={data}
        columns={columns}
        options={options}
      />
    </Container>
  );
};
export default CommandList;
