const templates = {
  markdown: `## [{{title}}]({{{url}}})
{{#steps}}> * {{text}}

{{#tip}}{{{tip}}}

{{/tip}}{{/steps}}
open in [pagenote.cn](https://pagenote.cn/webpage#/{{encodeUrl}})
    `,
}

export default templates

