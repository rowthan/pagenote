import mustache from 'mustache';

const templates = {
    markdown: {
        template: `## [{{title}}]({{{url}}})
{{#steps}}> * {{text}}

{{#tip}}{{{tip}}}

{{/tip}}{{/steps}}
> 导出模板基于 mustache 语法
    `,
        fileExt:'markdown',
        icon: '',
        name: 'markdown',
        description: '导出为Markdown格式'
    }
}

const dataToString = function (data,exportTemplate = templates.markdown) {

    let result = {
        success: false,
        data: null,
    }
    try{
        result.data = mustache.render(exportTemplate.template,{
            ...data,
            encodeUrl: encodeURIComponent(data.url)
        })
        result.success = true;
    }catch (e){
        console.error(e)
    }

    return result
}

export {
    dataToString
}