import {ActionConfig} from "./index";
import {ACTION_SCENE, ACTION_TYPES} from "./@types";
import {PREDEFINED_ICON} from "../icons";

const version = '0.1.0'
const send_to_email:ActionConfig = {
    define:{
        name:'发送到邮箱',
        actionType: ACTION_TYPES.send_to_email,
        version: version,
        icon: PREDEFINED_ICON.email,
        clickScript: function (e,target,API,params){
            const subject = encodeURIComponent("[PAGENOTE摘录]"+target.text);
            const body = encodeURIComponent(target.pre+target.text+target.suffix);
            const mailTo = "mailto:"+params.email+"?cc=pagenote@126.com&bcc=&subject="+subject+"&body="+body;
            const a = document.createElement('a');
            a.href=mailTo;
            a.click();
        },
        formConfig:[
            {
                gridSize: 12,
                name:'email',
                label: '邮箱地址📮 ',
                type: 'text',
            }
        ],
        description:"选中内容至邮件，邮件正文默认填充你选中的文本",
        scenes:[ACTION_SCENE.text]
    },
    initData:{
        customSetting: [{
            key:"email",
            value:"pagenote@126.com"
        }],
        shortcut: "",
        scene: ACTION_SCENE.text,
    }
};

export default send_to_email;