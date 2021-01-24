import translationService from "../translationService";
export default async langId => {
  const commandAlias = await translationService.getMessage(langId, "scroll_down_label");
  const description = await translationService.getMessage(
    langId,
    "command_scroll_down_description"
  );
  return {
    id: '0C52F324-0B39-8EC0-178E-7A2A16F6A629',
    name: commandAlias,
    description: description,
    match: "exact",
    exec: async (dom) => {
      dom.scroll('down');
    }
  };
};
