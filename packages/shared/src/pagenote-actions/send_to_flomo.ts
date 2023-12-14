import {ActionConfig} from "./index";
import {ACTION_SCENE, ACTION_TYPES} from "./@types";
import {PREDEFINED_ICON} from "../icons";

const version = '0.2.0'
const send_to_flomo:ActionConfig = {
    define:{
        name:'Send to flomo',
        actionType: ACTION_TYPES.send_to_flomo,
        version: version,
        icon: PREDEFINED_ICON.flomo,
        clickScript: function (e,target,API,params,) {
            API.methods.editConfirm("#pagenote "+target.text,function (confirm,result) {
                if(confirm){
                    const data = {
                        content: result,
                    }
                    API.methods.fetch({
                        url: params.apiLink,
                        method: 'POST',
                        data: data
                    }).then(function(result){
                        API.methods.notification({
                            message: result.json.message
                        })
                        console.log(result,'result')
                    }).catch(function(e){
                        API.methods.notification({
                            message: '发生了一些问题，确定 API 无误且已是 Flomo 会员？'
                        })
                    })
                }else{
                    API.methods.notification({
                        message: '已取消'
                    })
                }
            })
        },
        formConfig:[
            {
                gridSize: 12,
                name:'apiLink',
                label: '你的 API Link',
                type: 'text',
                rules:[{
                    required: true,
                    message:'请输入你的 API Link'
                },{
                    pattern: /^https:/,
                    message:'应该以https://开头'
                }]
            }
        ],
        description:"将选中内容发送到 Flomo 平台。",
        scenes: [ACTION_SCENE.text]
    },
    initData:{
        customSetting: [{
            key:"apiLink",
            value:""
        }],
        shortcut: "",
        scene: ACTION_SCENE.text,
    }
};

export default send_to_flomo;
