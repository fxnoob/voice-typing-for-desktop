import translationService from '../translationService';

export default async (langId) => {
  const commandAlias = await translationService.getMessage(
    langId,
    'cmd_label_undo_all'
  );
  const description = await translationService.getMessage(
    langId,
    'command_undo_all_description'
  );
  return {
    id: '4D743502-F987-405E-D163-E57E8DD201AE',
    name: commandAlias,
    description,
    match: 'exact',
    exec: async (text, options) => {
      const { dom } = options;
      try {
        dom.undoAll();
      } catch (e) {
        // eslint-disable-next-line
        console.log(e);
      }
    },
  };
};
