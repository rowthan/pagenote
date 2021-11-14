"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var send_to_flomo = {
    id: 'send_to_flomo',
    version: '0.0.1',
    icon: '<svg t="1621865073887" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1848" width="32" height="32"><path d="M0 0h1024v1024H0z" fill="#FAFAFA" p-id="1849"></path><path d="M709.461333 507.211852H332.069926V399.559111H779.567407l-65.422222 105.263408c0 2.389333-2.341926 2.389333-4.683852 2.389333zM807.604148 339.749926H450.066963L515.508148 234.477037c2.341926 0 4.67437-2.389333 7.016296-2.389333H877.700741l-65.422222 105.263407c0 2.398815-2.341926 2.398815-4.683852 2.398815z" fill="#30CF79" p-id="1850"></path><path d="M337.910519 791.912296c-105.159111 0-191.620741-88.519111-191.620741-196.181333 0-107.662222 86.46163-196.171852 191.620741-196.171852 105.14963 0 191.620741 88.50963 191.62074 196.171852s-86.471111 196.171852-191.62074 196.171852z m0-282.311111c-46.743704 0-86.471111 38.276741-86.471112 88.519111 0 47.853037 37.394963 88.528593 86.471112 88.528593 49.066667 0 86.46163-38.286222 86.461629-88.528593-2.341926-50.24237-39.727407-88.519111-86.471111-88.519111z" fill="#30CF79" p-id="1851"></path></svg>',
    name: 'Send to flomo',
    clickScript: "(function (API) {\n          var targetInfo = API.data.targetInfo || {};\n          var apiLink = API.data.action.settings.apiLink;\n          var data = {\n            content: \"#pagenote \"+targetInfo.text + \" \"+ API.data.href,\n          }\n          API.methods.axios({\n            method: 'POST',\n            url: apiLink,\n            data: data\n          }).then(function(result){\n            console.log(result);\n            if(result && result.data && result.data.code!==-1){\n                API.methods.notification(result.data.message)\n            } else {\n                API.methods.notification(result.data.message)\n            }\n            console.log(result,'result')\n          }).catch(function(e){\n            API.methods.notification('\u53D1\u751F\u4E86\u4E00\u4E9B\u95EE\u9898\uFF0C\u786E\u5B9A API \u65E0\u8BEF\u4E14\u5DF2\u662F Flomo \u4F1A\u5458\uFF1F'+e)\n          })\n        })(API)",
    settings: [
        {
            gridSize: 12,
            name: 'apiLink',
            label: '你的 API Link',
            type: 'text',
            rules: [{
                    required: true,
                    message: '请输入你的 API Link'
                }, {
                    pattern: /^https:/,
                    message: '应该以https://开头'
                }]
        }
    ],
    scene: 'text',
    description: "选中一段文本后，将数据发送到 Flomo 平台。注意：flomo 会员才支持。",
    defaultSetting: {
        apiLink: ''
    }
};
exports.default = send_to_flomo;
//# sourceMappingURL=send_to_flomo.js.map