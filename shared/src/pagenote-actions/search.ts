import {ActionConfig} from "./index";
import {ACTION_SCENE, ACTION_TYPES} from "./@types";
import {PREDEFINED_ICON} from "../icons";

const version = '0.1.0'
const search:ActionConfig = {
    define:{
        name:'选中搜索',
        actionType: ACTION_TYPES.search,
        version: version,
        icon: PREDEFINED_ICON.search,
        formConfig:[
            {
                gridSize: 4,
                name:'engine',
                label: '搜索引擎',
                type: 'select',
                data:[
                    {
                        value:'https://www.baidu.com/s?ie=utf-8&wd=${keyword}',
                        label:'百度搜索'
                    },
                    {
                        value:'https://search.bilibili.com/all?keyword=${keyword}',
                        label:'哔哩哔哩搜索'
                    },
                    {
                        value:'https://www.toutiao.com/search/?keyword=${keyword}',
                        label:'头条搜索'
                    },
                    {
                        value:'https://translate.google.cn/?sl=auto&tl=auto&text=${keyword}',
                        label:'Google翻译'
                    },
                    {
                        value:'https://www.douban.com/search?q=${keyword}',
                        label:'豆瓣搜索'
                    }
                ],
                rules:[],
            },
            {
                gridSize: 4,
                name:'new_tab',
                label: '出现方式',
                type: 'select',
                data:[
                    {
                        value:'1',
                        label:'新标签页打开'
                    },
                    {
                        value:'0',
                        label:'弹窗出现'
                    }
                ],
                rules:[{
                    required: true,
                    message:'选择出现方式'
                }]
            },
            {
                gridSize: 12,
                name:'engine',
                label: '自定义搜索引擎',
                type: 'text',
                rules:[{
                    pattern: /keyword/,
                    message:'搜索引擎中应该包含 ${keyword} 用于替换选中内容'
                }]
            }
        ],
        description: '点击使用搜索引擎搜索选中内容，如 百度、翻译等',
        clickScript:function (e,target,API,params) {
            const keyword = encodeURIComponent(target.text);
            const link = params.engine.replace('${keyword}',keyword);
            if(params.new_tab==='1'){
                window.open(link);
            }else{
                API.methods.popupwindow(link,'pagenote 带你搜索',800,500);
            }
        },
        scenes: [ACTION_SCENE.text]
    },
    initData:{
        customSetting: [
            {
                key:"engine",
                value:"https://www.baidu.com/s?ie=utf-8&wd=${keyword}"
            },{
                key:"new_tab",
                value:"0"
            }
        ],
        shortcut: "",
        scene: ACTION_SCENE.text,
    }
}
export default search;