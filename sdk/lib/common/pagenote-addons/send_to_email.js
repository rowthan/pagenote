var send_to_email = {
    icon: '<svg t="1603711839289" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3195" width="32" height="32"><path d="M960.9 405.7l-448 323.4-448-323.4 448-323.4z" fill="#5B79FB" p-id="3196"></path><path d="M187.3 139.1h651.2v795.4H187.3z" fill="#E5ECFF" p-id="3197"></path><path d="M335 222h355.7v73.9H335z" fill="#FF7E71" p-id="3198"></path><path d="M258.3 358h509.3v37H258.3zM258.3 420.7h509.3v37H258.3zM258.3 483.4h509.3v37H258.3zM258.3 546.1h509.3v37H258.3z" fill="#FFFFFF" p-id="3199"></path><path d="M64.9 934.5h896V405.7l-448 323.4-448-323.4z" fill="#5B79FB" p-id="3200"></path><path d="M64.9 934.5h896L594.6 670.1H431.2z" fill="#83A4FF" p-id="3201"></path></svg>',
    id: 'send_to_email',
    name: '发送到邮箱',
    clickScript: "(function (API) {\n          var targetInfo = API.data.targetInfo || {};\n          var subject = encodeURIComponent(\"[PAGENOTE\u6458\u5F55]\"+targetInfo.text);\n          var body = encodeURIComponent(targetInfo.pre+targetInfo.text+targetInfo.suffix+\"----------\u6765\u81EA\"+API.data.href);\n          var mailTo = \"mailto:\"+API.data.action.settings.email+\"?cc=pagenote@126.com&bcc=&subject=\"+subject+\"&body=\"+body;\n          var a = document.createElement('a');\n          a.href=mailTo;\n          a.click();\n      })(API)",
    scene: 'text',
    settings: [
        {
            gridSize: 12,
            name: 'email',
            label: '邮箱地址📮 ',
            type: 'text',
        }
    ],
    defaultSetting: {
        email: 'pagenote@126.com'
    },
    description: "选中一段文本后，点击此按钮可快速打开邮箱（需要你已安装邮箱客户端），新建一封邮件，邮件正文默认填充你选中的文本。"
};
export default send_to_email;
//# sourceMappingURL=send_to_email.js.map