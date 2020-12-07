import defaultLangeObject from './zh_CN.json';

let language = 'zh_CN';
const defaultLanguage = 'zh_CN';
let i18nObject = {
  [defaultLanguage]: defaultLangeObject,
};

export default {
  setLang: function (lang,values){
    i18nObject[lang] = values;
  },
  t: function (key,values=[]){
    const langObject = i18nObject[language] || i18nObject[defaultLanguage] || {};
    let message = langObject[key].message || key;
    message = message.replace(/\$\{.*?\}/,values[0]);
    return message;
  },
  setLangType: function (lang){
    language = lang;
  },
  getLangType: function (){
    return language;
  }
}

function getBrowserLanguage(){
  let language = navigator.language || navigator.userLanguage || function (){
    const languages = navigator.languages;
    if (navigator.languages.length > 0){
      return navigator.languages[0];
    }
  }() || 'en';
  return language.split('-')[0];
}
