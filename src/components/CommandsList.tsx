import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
// @ts-ignore
import MUIDataTable from 'mui-datatables';
import Checkbox from '@material-ui/core/Checkbox';
import db from '../services/dbService';
import translationService from '../services/translationService';
import commandService from '../services/commandsService';

const CommandList = (props: { langId: any; langLabel: any; }) => {
  const {langId, langLabel} = props;
  const columns = [
    translationService.getMessage(langId, 'command_name_label'),
    translationService.getMessage(langId, 'command_description_label'),
    translationService.getMessage(langId, 'command_enable_disable_label')
  ];
  const [language, setLanguage] = useState('');
  const [data, setData] = useState([]);
  const handleChange = (id: string, arr: { [x: string]: any; }) => async () => {
    arr[id] = !arr[id];
    // @ts-ignore
    await db.set({ commandsConfig: arr });
    init().catch(() => {});
  };
  useEffect(() => {
    init().catch(() => {});
  }, []);
  const init = async () => {
    const { commandsConfig } = (await db.get('commandsConfig')) || {};
    setLanguage(langLabel);
    const commandsJson = await commandService.getCommands(langId);
    const commandsList = commandsJson.map((command) => {
      return [
        command.name,
        command.description,
        <Checkbox
          key={command.id}
          checked={commandsConfig[command.id]}
          onChange={handleChange(command.id, commandsConfig)}
          inputProps={{ 'aria-label': 'enable/disable command' }}
        />,
      ];
    });
    // @ts-ignore
    setData(commandsList);
  };
  const options = {
    rowsPerPage: 13,
    selectableRows: false
  };
  return (
    <Container>
      <MUIDataTable
        title={`${translationService.getMessage(langId, 'commands_list_label')}: ${language}`}
        data={data}
        columns={columns}
        options={options}
      />
    </Container>
  );
};
export default CommandList;
