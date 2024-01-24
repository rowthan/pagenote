import Handlebars from 'handlebars';

export function replaceVariables(input: Record<string, any>, variables: Record<string, any>) {
    // 注册 handlebars helper 函数
    Handlebars.registerHelper('lookup', function (obj, key) {
        return obj[key];
    });

    // const inputStr = JSON.stringify(input)//.replace(/\$\{\{/g,"{{")
    // 使用 handlebars 处理模板
    const template = Handlebars.compile(input,{

    });
    const replacedString = template(variables);

    const replacedObject = JSON.parse(replacedString);
    return replacedObject;
}
