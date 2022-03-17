import {ActionConfig} from "./index";
import {ACTION_SCENE, ACTION_TYPES} from "./@types";
import {PREDEFINED_ICON} from "../icons";

const version = '0.1.0'
const send_to_flomo:ActionConfig = {
    define:{
        name:'Send to flomo',
        actionType: ACTION_TYPES.send_to_flomo,
        version: version,
        icon: PREDEFINED_ICON.flomo,
        clickScript: `(function (API) {
          var targetInfo = API.data.targetInfo || {};
          var apiLink = API.data.action.settings.apiLink;
          var data = {
            content: "#pagenote "+targetInfo.text + " "+ API.data.href,
          }
          API.methods.axios({
            method: 'POST',
            url: apiLink,
            data: data
          }).then(function(result){
            console.log(result);
            if(result && result.data && result.data.code!==-1){
                API.methods.notification(result.data.message)
            } else {
                API.methods.notification(result.data.message)
            }
            console.log(result,'result')
          }).catch(function(e){
            API.methods.notification('发生了一些问题，确定 API 无误且已是 Flomo 会员？'+e)
          })
        })(API)`,
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
        description:"将选中内容发送到 Flomo 平台。注意：flomo 会员才支持。",
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