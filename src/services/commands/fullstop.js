import translationService from '../translationService';

export default async (langId) => {
  const commandAlias = await translationService.getMessage(
    langId,
    'full_stop_label'
  );
  const description = await translationService.getMessage(
    langId,
    'command_fullstop_description'
  );
  return {
    id: 'BAC548F8-69DB-07DE-2AA6-E687AEF889CC',
    name: commandAlias,
    description,
    match: 'exact',
    exec: async (text, options, callback) => {
      const { dom, ackId } = options;
      dom.simulateWordTyping('.', ackId);
      callback();
    },
  };
};
