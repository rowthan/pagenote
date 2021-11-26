var create_new_light = {
    id: 'create_new_pagenote',
    icon: '<svg t="1603689943505" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1288" width="32" height="32"><path d="M424.64 623.936l-153.6-164.544a57.728 57.728 0 0 1 0-77.568 48.768 48.768 0 0 1 72.384 0L460.8 507.584l219.84-235.456a48.768 48.768 0 0 1 72.384 0 57.728 57.728 0 0 1 0 77.568l-256 274.304A49.728 49.728 0 0 1 460.8 640a49.28 49.28 0 0 1-36.16-16.064z" fill="#4D94FF" p-id="1289"></path><path d="M896 128v712.32l-48.896-32.576a127.744 127.744 0 0 0-161.472 16l-45.632 45.632-38.272-38.272a127.552 127.552 0 0 0-90.496-37.504c-32 0-64.064 11.968-88.896 35.968l-41.28 39.808-41.792-43.456a128 128 0 0 0-163.2-17.664L128 840.32V128h768m64-128H64C28.736 0 0 28.672 0 64v895.936c0 23.616 12.992 45.248 33.792 56.512a64.576 64.576 0 0 0 65.792-3.264l147.52-98.368 86.336 89.6c11.84 12.096 28.032 19.264 44.992 19.52l2.24 0.064a61.44 61.44 0 0 0 43.392-18.048L511.232 921.6l83.52 83.52a63.808 63.808 0 0 0 90.496 0l90.88-90.88 148.352 98.88A64 64 0 0 0 1024 959.872V64a64 64 0 0 0-64-64z" fill="#4D94FF" p-id="1290"></path></svg>',
    name: '高亮选中文本',
    shortcut: '',
    clickScript: "(function(API){API.methods.createLight({bg:API.data.action.settings.bg});})(API);",
    scene: 'text',
    description: "画笔颜色太少了？使用此方式可以增添画笔。",
    settings: [{
            gridSize: 12,
            name: 'bg',
            label: '画笔颜色😍 ',
            type: 'color',
        }],
    defaultSetting: {
        bg: '#FFDE5D'
    }
};
export default create_new_light;
//# sourceMappingURL=create_new_light.js.map