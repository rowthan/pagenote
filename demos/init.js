

window.initPagenote = function () {
    // 如何使用 就看这里就好了，使用前，记得先引入 SDK
    window.pagenote = new window.PageNote('demos',{
        saveInLocalId: 'demo-store', // 是否缓存数据在用户侧 localstorage中，如果要讲数据存储在服务器端，则不用
        functionColors:[ // 支持扩展的功能按钮区，
            [
                {
                    icon:'<svg t="1604927420311" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3896" width="256" height="256"><path d="M641.5 649.2H381.4c-13.9-30.1-30.5-60.2-47-89.7-36.4-65.1-73.9-132.4-73.9-189 0-138.3 112.5-250.8 250.8-250.8s250.8 112.5 250.8 250.8c0 56.2-37.6 123.9-74 189.4-16.2 29.3-32.8 59.4-46.6 89.3z" fill="#EDF5F9" p-id="3897"></path><path d="M511.3 63.9c-169.3 0-306.6 137.2-306.6 306.6 0 112.4 102.8 231.4 140.2 336 55.8 156 49.6 249.3 166.3 249.3 118.4 0 110.5-92.9 166.3-248.6C715.2 602.3 817.9 482 817.9 370.5c0-169.3-137.2-306.6-306.6-306.6z m72.3 757.4l-138.2 17.3c-4.9-14.3-10.2-31-16.6-52.8l-0.3-0.9L601 763.4c-2.4 8.2-5.1 16.9-7.3 24.6-3.7 12.6-7 23.4-10.1 33.3z m-163.2-63.2c-5.1-16.8-10.8-34.5-17.2-53.2h216.4c-3.4 10-6.8 20-9.8 29.5l-189.4 23.7zM511.3 900c-28.2 0-41.2-3.2-55.7-34.8l118.1-14.8c-17 46.1-29.5 49.6-62.4 49.6z m130.2-250.8H381.4c-13.9-30.1-30.5-60.2-47-89.7-36.4-65.1-73.9-132.4-73.9-189 0-138.3 112.5-250.8 250.8-250.8s250.8 112.5 250.8 250.8c0 56.2-37.6 123.9-74 189.4-16.2 29.3-32.8 59.4-46.6 89.3z" fill="#144A8A" p-id="3898"></path><path d="M495.3 203.3c-92.2 0-167.2 75-167.2 167.2 0 7.7 6.2 13.9 13.9 13.9s13.9-6.2 13.9-13.9c0-76.8 62.5-139.4 139.4-139.4 7.7 0 13.9-6.2 13.9-13.9s-6.2-13.9-13.9-13.9zM583.6 821.3l-138.2 17.3c-4.9-14.3-10.2-31-16.6-52.8l-0.3-0.9L601 763.4c-2.4 8.2-5.1 16.9-7.3 24.6-3.7 12.6-7 23.4-10.1 33.3zM420.4 758.1c-5.1-16.8-10.8-34.5-17.2-53.2h216.4c-3.4 10-6.8 20-9.8 29.5l-189.4 23.7zM511.3 900c-28.2 0-41.2-3.2-55.7-34.8l118.1-14.8c-17 46.1-29.5 49.6-62.4 49.6z" fill="#9FC8E2" p-id="3899"></path></svg>',
                    name:'自定义扩展1',
                    shortcut: 'h',
                    onclick: function (e,target) {
                        alert('点击了')
                    },
                    onmouseover: function (e) {
                        console.log('鼠标经过了',e)
                    }
                },
            ],
            [
                {
                    icon:'<svg t="1604927420311" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3896" width="256" height="256"><path d="M641.5 649.2H381.4c-13.9-30.1-30.5-60.2-47-89.7-36.4-65.1-73.9-132.4-73.9-189 0-138.3 112.5-250.8 250.8-250.8s250.8 112.5 250.8 250.8c0 56.2-37.6 123.9-74 189.4-16.2 29.3-32.8 59.4-46.6 89.3z" fill="#EDF5F9" p-id="3897"></path><path d="M511.3 63.9c-169.3 0-306.6 137.2-306.6 306.6 0 112.4 102.8 231.4 140.2 336 55.8 156 49.6 249.3 166.3 249.3 118.4 0 110.5-92.9 166.3-248.6C715.2 602.3 817.9 482 817.9 370.5c0-169.3-137.2-306.6-306.6-306.6z m72.3 757.4l-138.2 17.3c-4.9-14.3-10.2-31-16.6-52.8l-0.3-0.9L601 763.4c-2.4 8.2-5.1 16.9-7.3 24.6-3.7 12.6-7 23.4-10.1 33.3z m-163.2-63.2c-5.1-16.8-10.8-34.5-17.2-53.2h216.4c-3.4 10-6.8 20-9.8 29.5l-189.4 23.7zM511.3 900c-28.2 0-41.2-3.2-55.7-34.8l118.1-14.8c-17 46.1-29.5 49.6-62.4 49.6z m130.2-250.8H381.4c-13.9-30.1-30.5-60.2-47-89.7-36.4-65.1-73.9-132.4-73.9-189 0-138.3 112.5-250.8 250.8-250.8s250.8 112.5 250.8 250.8c0 56.2-37.6 123.9-74 189.4-16.2 29.3-32.8 59.4-46.6 89.3z" fill="#144A8A" p-id="3898"></path><path d="M495.3 203.3c-92.2 0-167.2 75-167.2 167.2 0 7.7 6.2 13.9 13.9 13.9s13.9-6.2 13.9-13.9c0-76.8 62.5-139.4 139.4-139.4 7.7 0 13.9-6.2 13.9-13.9s-6.2-13.9-13.9-13.9zM583.6 821.3l-138.2 17.3c-4.9-14.3-10.2-31-16.6-52.8l-0.3-0.9L601 763.4c-2.4 8.2-5.1 16.9-7.3 24.6-3.7 12.6-7 23.4-10.1 33.3zM420.4 758.1c-5.1-16.8-10.8-34.5-17.2-53.2h216.4c-3.4 10-6.8 20-9.8 29.5l-189.4 23.7zM511.3 900c-28.2 0-41.2-3.2-55.7-34.8l118.1-14.8c-17 46.1-29.5 49.6-62.4 49.6z" fill="#9FC8E2" p-id="3899"></path></svg>',
                    name:'自定义扩展2',
                    shortcut: '2',
                    onclick: function (e) {
                        console.log('clicked',e);
                        e.stopPropagation();
                    },
                    onmouseover: function (e) {
                        console.log('鼠标经过了',e)
                    },
                    ondbclick: function (e) {
                        console.log('dbclicked',e)
                    }
                }
            ]
        ],
        categories:[{ // 默认的候选标签
            label:'候选项1'
        },{
            label:'候选项2'
        }],
        brushes:[ // 画笔
            {
                bg:'#FF6900', // rgb 颜色值
                shortcut:'p', // 快捷键，可选
                label:'一级画笔', // 说明
                level:1, // 暂不支持
            },
            {
                bg:'#FCB900',
                shortcut:'p',
                label:'一级画笔',
                level:1,
            },
            {
                bg: '#7BDCB5',
            },
            {
                bg: '#8ED1FC',
            },
            {
                bg:'rgb(87,134,248)',
                shortcut:'p',
                label:'一级画笔',
                level:1,
            }
        ],
        showBarTimeout: 100, // 延迟功能时间 单位毫秒
        renderAnnotation: function (data,light) { // 自定义笔记渲染逻辑，这里可以处理为从服务器端根据 lightId 查询数据来渲染，包括点赞量等数据
            const element = document.createElement('div');
            const {tip,lightId,time} = data;
            const aside = document.createElement('div');
            aside.innerHTML = `<pagenote-block aria-controls="aside-info">
            ${new Date(time).toLocaleDateString()}
            <a style="position: absolute;right:0" target="_blank" href="https://pagenote.cn/me">
                <img  width="16" height="16" src="https://pagenote.cn/favicon.ico" alt="用户名" title="用户名">
            </a>
            </pagenote-block>`
            element.appendChild(aside);

            element.ondblclick = function () {
                light.openEditor();
            };

            const asides = [{
                text: '分享到朋友圈',
                onclick: function () {
                    alert('分享啦')
                }
            },{
                text: '好好收藏',
                onclick: function () {
                    alert('收藏了')
                }
            },{
                text: '贴紧',
                onclick: function (e) {
                    light.connectToKeywordTag();// 将批注贴紧至高亮处
                }
            }];
            return [null,asides]
        }
    });


    const defaultData = {"steps":[{"lightStatus":2,"annotationStatus":2,"lightId":"83244d1d159c5edc9a547a5b5361b7fa","x":520,"y":130,"id":"span","text":"4.8.0-typescript","tip":"这里是最新的版本，快来试试吧","bg":"rgb(225,192,63)","time":1627742525241,"isActive":false,"offsetX":0.5,"offsetY":0.9,"parentW":0,"pre":"","suffix":"。我们对 UI、交互","images":[],"level":1},{"lightStatus":2,"annotationStatus":1,"lightId":"8e7f34a04d8ca85194e150445d4f2ba3","x":730,"y":330,"id":"li  ul  li:nth-child(3)","text":"双击可以快速进入编辑状态","tip":"侧边栏的双击同样有效","bg":"rgb(87,134,248)","time":1627743186494,"isActive":false,"offsetX":0.5,"offsetY":0.9,"parentW":620,"pre":"单击高亮区域能切换状态：浅高亮、深高亮；","suffix":"。","images":[],"level":1},{"lightStatus":2,"annotationStatus":2,"lightId":"99b3bd737f025921d26761865f84b672","x":448,"y":1666,"id":"article  section:nth-child(8)  h2","text":"关于我","tip":"多谢关注","bg":"rgb(246,227,154)","time":1627743132776,"isActive":false,"offsetX":0.5,"offsetY":0.9,"parentW":700,"pre":"","suffix":"","images":[],"level":1}],"setting":{"barInfo":{"right":96,"top":132,"status":"fold"}},"url":"http://0.0.0.0:8080/","lastModified":1627743295253,"icon":"https://pagenote.cn/favicon.ico","title":"pagenote demos","description":"这是pagenote 运行 demos","images":[],"snapshots":[],"version":2,"categories":[],"note":""};
// 这里可以从服务器端拉取数据，用于 init
    pagenote.init(); // 初始化开始工作

    pagenote.addListener(function (status) {
        if(status===pagenote.CONSTANT.SYNCED){
            // 数据变化回调，将数据发送到服务器端，在这里处理
            console.log('数据发生的变化',pagenote.plainData)
        }
    })

}

