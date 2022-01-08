var _a;
import defaultLangeObject from './zh_CN.json';
var language = 'zh_CN';
var defaultLanguage = 'zh_CN';
var i18nObject = (_a = {},
    _a[defaultLanguage] = defaultLangeObject,
    _a);
export default {
    setLang: function (lang, values) {
        i18nObject[lang] = values;
    },
    t: function (key, values) {
        if (values === void 0) { values = []; }
        var langObject = i18nObject[language] || i18nObject[defaultLanguage] || {};
        var message = langObject[key] ? langObject[key].message : key;
        message = message.replace(/\$\{.*?\}/, values[0]);
        return message;
    },
    setLangType: function (lang) {
        language = lang;
    },
    getLangType: function () {
        return language;
    }
};
function getBrowserLanguage() {
    var language = navigator.language || navigator.userLanguage || function () {
        var languages = navigator.languages;
        if (navigator.languages.length > 0) {
            return navigator.languages[0];
        }
    }() || 'en';
    return language.split('-')[0];
}
//# sourceMappingURL=i18n.js.map