import {ActionConfig} from "./index";
import {ACTION_SCENE, ACTION_TYPES} from "./@types";
import {PREDEFINED_ICON} from "../icons";

const version = '0.1.0'
const fetch:ActionConfig = {
    define:{
        name:'请求 API',
        actionType: ACTION_TYPES.fetch,
        version: version,
        icon: PREDEFINED_ICON.api,
        clickScript: function (e,target,API,params,) {
            const data = {
                content: "#pagenote "+target.text,
            }
            API.methods.fetch({
                init:{
                    method: 'POST',
                    data: data
                },
                input: params.apiLink,
            }).then(function(result){
                API.methods.notification({
                    message: result.jsonData.message
                })
                console.log(result,'result')
            }).catch(function(e){
                console.log(e)
                API.methods.notification({
                    message: '发生了一些错误'
                })
            })
        },
        formConfig:[
            {
                gridSize: 12,
                name:'api',
                label: 'API 地址',
                type: 'text',
                rules:[{
                    required: true,
                    message:'请输入 API 请求地址'
                },{
                    pattern: /^https:/,
                    message:'应该以https://开头'
                }]
            }
        ],
        description:"将选中内容发送到指定 API",
        scenes: [ACTION_SCENE.text]
    },
    initData:{
        customSetting: [{
            key:"api",
            value:""
        }],
        shortcut: "",
        scene: ACTION_SCENE.text,
    }
};

export default fetch;
