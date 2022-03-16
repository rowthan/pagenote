import {ActionConfig} from "./index";
import {ActionScene, ActionTypes} from "./@types";

const customAction:ActionConfig = {
    icon:'',
    name:'自定义脚本',
    shortcut:'',
    clickScript: `(function(API,e,config){console.log(API);})(API,e,config);`,
    scene: ActionScene.all,
    description:"运行任意自定义脚本",
    formConfig:[{
        gridSize: 12,
        name:'script',
        label: '脚本',
        type: 'textarea',
        rules:[{
            required: true,
            message:"请输入脚本"
        }]
    }],
    customSetting:[{
        key:'script',
        value:'alert("运行自定义脚本")'
    }],
    version:"0.1.1",
    actionType: ActionTypes.create_new_pagenote
}

export default customAction;