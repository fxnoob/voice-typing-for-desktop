import chromeService from "./chromeService";
class I18n {
  getMessage(key) {
    return chromeService.getI18nMessage(key);
  }
}
const i18n = new I18n();
export default i18n;
