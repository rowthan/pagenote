Hi, let me tell you something about how to translate it.

## Before start work

* your can find a file named `country or region`.json. such as `zh_CN.json` `en.json`.
* If you did not find your [language](https://developer.chrome.com/webstore/i18n#localeTable), you can copy and create a file by yourself.
* translate or modify the `message` apart in the file. tips: you should only translate the content after `message` key. Do not modify other parts.
* keep the variable original appearance like `${variable}`, just find a good place for it in you words.

## Merge you work
### for developer (recommend)
* You can fork the repository and pull a merge request

### for customer
* Send you file to my email, logikecn@gmai.com

## Example
### before
```json
{
  "most_cnt": {
    "message": "最多设置${count}个"
  }
}
```

### after 
* Translate to English
```json
{
  "most_cnt": {
    "message": "${count} limited"
  }
}
```

* Translate to Russian
```json
{
  "most_cnt": {
    "message": "максимум ${count} ограничен"
  }
}
```
