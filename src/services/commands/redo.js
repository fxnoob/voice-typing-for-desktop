import translationService from "../translationService";

export default async langId => {
  const commandAlias = await translationService.getMessage(
    langId,
    "label_redo"
  );
  const description = await translationService.getMessage(
    langId,
    "command_redo_description"
  );
  return {
    id: '35702128-F219-F734-0867-1364887AF2B2',
    name: commandAlias,
    description: description,
    match: "exact",
    exec: async (text, options, callback) => {
      const { dom } = options;
      try {
        dom.redo();
        callback();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  };
};
