const copy_to_clipboard = {
    icon:'<svg t="1636295911396" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3360" width="20" height="20"><path d="M262.016 262.016m170.666667 0l335.317333 0q170.666667 0 170.666667 170.666667l0 335.317333q0 170.666667-170.666667 170.666667l-335.317333 0q-170.666667 0-170.666667-170.666667l0-335.317333q0-170.666667 170.666667-170.666667Z" fill="#FFB531" p-id="3361"></path><path d="M298.666667 170.666667a128 128 0 0 0-128 128v318.037333a42.666667 42.666667 0 0 1-42.666667 42.666667 42.666667 42.666667 0 0 1-42.666667-42.666667V298.666667a213.333333 213.333333 0 0 1 213.333334-213.333334h317.994666a42.666667 42.666667 0 0 1 42.666667 42.666667 42.666667 42.666667 0 0 1-42.666667 42.666667z" fill="#030835" p-id="3362"></path></svg>',
    id:'copy',
    name:'拷贝至剪切板',
    description: '点击此按钮。将选取内容拷贝至剪切板，并记录在历史中，过期后自动删除',
    scene: 'text',
    // @ts-ignore
    settings:[],
    clickScript: `(function (API) {
        API.methods.addToClipboards(API.data.text);
        API.methods.writeTextToClipboard(API.data.text);
        API.methods.notification({
          message: '已拷贝至剪切板'
        });
    })(API)`,
}

export default copy_to_clipboard;