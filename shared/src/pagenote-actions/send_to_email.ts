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
        clickScript: `(function (API) {
          var targetInfo = API.data.targetInfo || {};
          var subject = encodeURIComponent("[PAGENOTE摘录]"+targetInfo.text);
          var body = encodeURIComponent(targetInfo.pre+targetInfo.text+targetInfo.suffix+"----------来自"+API.data.href);
          var mailTo = "mailto:"+API.data.action.settings.email+"?cc=pagenote@126.com&bcc=&subject="+subject+"&body="+body;
          var a = document.createElement('a');
          a.href=mailTo;
          a.click();
      })(API)`,
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