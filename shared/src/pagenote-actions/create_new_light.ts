import {ActionConfig} from "./index";
import {ACTION_SCENE, ACTION_TYPES} from "./@types";
import {PREDEFINED_ICON} from "../icons";

const version = '0.1.0'
const create_new_light:ActionConfig = {
    define:{
        name:'高亮选中文本',
        scenes: [ACTION_SCENE.text],
        icon: PREDEFINED_ICON.create_new_light,
        clickScript: function (e,target,API,params){
            API.methods.createLight({bg:params.bg});
        },
        description:"画笔颜色太少了？使用此方式可以增添画笔。",
        formConfig:[{
            gridSize: 12,
            name:'bg',
            label: '画笔颜色😍 ',
            type: 'color',
            rules:[]
        }],
        version:version,
        actionType: ACTION_TYPES.create_new_pagenote,
    },
    initData:{
        shortcut:'',
        scene: ACTION_SCENE.text,
        customSetting:[{
            key: "bg",
            value:"#FFDE5D"
        }],
    }
}

export default create_new_light;