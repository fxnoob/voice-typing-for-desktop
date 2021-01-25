import translationService from '../translationService';

export default async (langId) => {
  const commandAlias = await translationService.getMessage(
    langId,
    'new_line_label'
  );
  const description = await translationService.getMessage(
    langId,
    'command_newline_description_new'
  );
  return {
    id: 'C52EC66E-9A89-29A8-42B3-4CC7B7132E6C',
    name: commandAlias,
    description,
    match: 'exact',
    exec: async (text, options, callback) => {
      const { dom } = options;
      dom.pressEnter();
      callback();
    },
  };
};
