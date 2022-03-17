import {ActionConfig} from "./index";
import {ACTION_SCENE, ACTION_TYPES} from "./@types";
import {PREDEFINED_ICON} from "../icons";

const version = '0.1.0'
const copy:ActionConfig = {
    define:{
        name:'拷贝至剪切板',
        icon: PREDEFINED_ICON.copy,
        version: version,
        actionType: ACTION_TYPES.copyToClipboard,
        scenes: [ACTION_SCENE.text],
        description: '点击此按钮。将选取内容拷贝至剪切板，并记录在历史中，过期后自动删除',
        formConfig:[],
        clickScript: `(function (API) {
            API.methods.addToClipboards(API.data.text);
            API.methods.writeTextToClipboard(API.data.text);
            API.methods.notification({
              message: '已拷贝至剪切板'
            });
        })(API)`,
    },
    initData: {
        customSetting: [],
        shortcut: "",
        scene: ACTION_SCENE.text
    }
}

export default copy;