const send_to_email = {
    icon:'<svg t="1603711839289" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3195" width="32" height="32"><path d="M960.9 405.7l-448 323.4-448-323.4 448-323.4z" fill="#5B79FB" p-id="3196"></path><path d="M187.3 139.1h651.2v795.4H187.3z" fill="#E5ECFF" p-id="3197"></path><path d="M335 222h355.7v73.9H335z" fill="#FF7E71" p-id="3198"></path><path d="M258.3 358h509.3v37H258.3zM258.3 420.7h509.3v37H258.3zM258.3 483.4h509.3v37H258.3zM258.3 546.1h509.3v37H258.3z" fill="#FFFFFF" p-id="3199"></path><path d="M64.9 934.5h896V405.7l-448 323.4-448-323.4z" fill="#5B79FB" p-id="3200"></path><path d="M64.9 934.5h896L594.6 670.1H431.2z" fill="#83A4FF" p-id="3201"></path></svg>',
    id:'send_to_email',
    name:'发送到邮箱',
    clickScript: `(function (API) {
          var targetInfo = API.data.targetInfo || {};
          var subject = encodeURIComponent("[PAGENOTE摘录]"+targetInfo.text);
          var body = encodeURIComponent(targetInfo.pre+targetInfo.text+targetInfo.suffix+"----------来自"+API.data.href);
          var mailTo = "mailto:"+API.data.action.settings.email+"?cc=pagenote@126.com&bcc=&subject="+subject+"&body="+body;
          var a = document.createElement('a');
          a.href=mailTo;
          a.click();
      })(API)`,
    scene: 'text',
    settings:[
        {
            gridSize: 12,
            name:'email',
            label: '邮箱地址📮 ',
            type: 'text',
        }
    ],
    defaultSetting: {
        email: 'pagenote@126.com'
    },
    description:"选中内容至邮件，邮件正文默认填充你选中的文本"
};

export default send_to_email;