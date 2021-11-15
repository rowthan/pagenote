var search = {
    icon: '<svg t="1622213082028" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3210" width="32" height="32"><path d="M884.01765791 884.01765791a73.93564003 73.93564003 0 0 1-104.56927271 0l-130.47985307-130.47985309a342.75238607 342.75238607 0 0 1-185.56742176 54.91100759 345.04770205 345.04770205 0 1 1 345.04770204-345.04770204 342.75238607 342.75238607 0 0 1-54.91100759 185.56742176l130.52399384 130.47985307a73.97978081 73.97978081 0 0 1-0.04414075 104.56927271zM463.40111037 216.9195494a246.48156196 246.48156196 0 1 0 0 492.9631229 246.48156196 246.48156196 0 0 0 0-492.9631229z" fill="#1296db" p-id="3211"></path></svg>',
    id: 'search',
    name: '选中搜索',
    settings: [
        {
            gridSize: 4,
            name: 'engine',
            label: '搜索引擎',
            type: 'select',
            data: [
                {
                    value: 'https://www.baidu.com/s?ie=utf-8&wd=${keyword}',
                    label: '百度搜索'
                },
                {
                    value: 'https://search.bilibili.com/all?keyword=${keyword}',
                    label: '哔哩哔哩搜索'
                },
                {
                    value: 'https://www.toutiao.com/search/?keyword=${keyword}',
                    label: '头条搜索'
                },
                {
                    value: 'https://translate.google.cn/?sl=auto&tl=auto&text=${keyword}',
                    label: 'Google翻译'
                },
                {
                    value: 'https://www.douban.com/search?q=${keyword}',
                    label: '豆瓣搜索'
                }
            ]
        },
        {
            gridSize: 4,
            name: 'new_tab',
            label: '出现方式',
            type: 'select',
            data: [
                {
                    value: '1',
                    label: '新标签页打开'
                },
                {
                    value: '0',
                    label: '弹窗出现'
                }
            ],
            rules: [{
                    required: true,
                    message: '选择出现方式'
                }]
        },
        {
            gridSize: 12,
            name: 'engine',
            label: '自定义搜索引擎',
            type: 'text',
            rules: [{
                    pattern: /keyword/,
                    message: '搜索引擎中应该包含 ${keyword} 用于替换选中内容'
                }]
        }
    ],
    description: '点击使用搜索引擎搜索选中内容，如 百度、翻译等',
    scene: 'text',
    clickScript: "(function (API) {\n      var targetInfo = API.data.targetInfo || {};\n      var actionSetting = API.data.action.settings || {};\n      var URL = actionSetting.engine.replace(\"${keyword}\",targetInfo.text);\n      if(actionSetting.new_tab==='0'){\n         API.methods.popupwindow(URL,'pagenote \u5E26\u4F60\u641C\u7D22')\n      } else {\n         window.open(URL)\n      }\n    })(API)",
    defaultSetting: {
        engine: "https://www.baidu.com/s?ie=utf-8&wd=${keyword}",
        new_tab: "0",
    }
};
export default search;
//# sourceMappingURL=search.js.map